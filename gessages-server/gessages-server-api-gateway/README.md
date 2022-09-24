# Gessages Gateway

The gateway authenticates requests and forwards them to the Services

## Docker

```
docker build . -t <tag>/api-gateway
```

### Available environment variables:

see config.ts for explanations

```
- PORT    (default: 3000)

// Redis
- DB_HOST
- DB_PORT
- DB_AUTH

- LOGLEVEL (default: "debug")
- SECRET

// Microservices
USERS     (default: "http://localhost:3001")
MESSAGES  (default: "http://localhost:3002")
```

## Run Test

```
npm run test
```

## TODO:

- [ ] Implement JWT Refresh Token
- [ ] Tests
- [ ] Proper types everywhere


