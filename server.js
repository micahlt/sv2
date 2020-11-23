const fetch = require('node-fetch');
const cryptoRandomString = require('crypto-random-string');
var Datastore = require('nedb');
var db = new Datastore();
const html = require('node-html-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile('landing.html', {
    root: __dirname + '/public'
  });
});
app.get('/style.css', (req, res) => {
  res.sendFile('style.css', {
    root: __dirname + '/public'
  });
});
app.get('/api', (req, res) => {
  res.sendStatus(200);
});
app.post('/api/init', (req, res) => {
  if (req.body.user) {
    db.find({
      user: req.body.user
    }, (err, docs) => {
      if (docs[0]) {
        db.remove({
          user: req.body.user
        }, {}, (err, numRemoved) => {
          console.log(`Removed duplicate user ${req.body.user} from database`);
        });
      }
    });
    var code = cryptoRandomString({
      length: 50,
      type: 'alphanumeric'
    });
    var doc = {
      user: req.body.user,
      code: code
    }
    db.insert(doc, (err, newDoc) => {
      console.log(`Successfully created a verification code for user ${req.body.user}`);
      res.send({
        code: code
      });
    })
  } else {
    res.sendStatus(406);
  }
});
app.post('/api/verify', (req, res) => {
  if (req.body.user) {
    db.find({
      user: req.body.user
    }, (err, docs) => {
      if (docs[0] !== undefined) {
        console.log(`User ${req.body.user} exists in database`);
        var code = docs[0].code;
        fetch(`https://scratch.mit.edu/site-api/comments/user/${req.body.user}/?page=1`)
          .then((res) => {
            return res.text();
          })
          .then((data) => {
            const root = html.parse(data);
            var detectedComment = root.querySelector('.content').text.trim();
            if (detectedComment == docs[0].code) {
              res.sendStatus(200);
            } else {
              res.sendStatus(403);
            }
          })
      } else {
        res.sendStatus(403);
      }
    })
  } else {
    res.sendStatus(406);
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});