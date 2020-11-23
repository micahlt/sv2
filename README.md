# sv²

A next-generation alternative to [ScratchVerifier](http://scratchverifier.ddns.net:8888/site)

## API Reference

### `GET /api`

This requests the status of the server.

**Good response**:

```bash
200 OK
```

**Bad response**:

```bash
500 Server Error
```

### `POST /api/verify`

This requests a user's profile to be checked for the code.

**Body:**

```json
{
  "user": "scratch_username"
}
```

**Good response**:

```json
{
  "code": "3Q8Q8UqObPEQocs3UiVHXy2fp2QqcoQVtlu5seN3nb5BZauFTz"
}
```

**Bad response**:

```bash
406 Not Acceptable
```

### `POST /api/verify`

**Body:**

```json
{
  "user": "scratch_username"
}
```

**Good response**:

```bash
200 OK
```

**Bad response**:

```bash
403 Forbidden
```
