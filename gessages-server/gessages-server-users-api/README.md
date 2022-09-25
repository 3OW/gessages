## Docker

```
docker build . -t <tag>/users-api
```

### Available environment variables:

see config.ts for explanations

```
- PORT    (default: 3001)
- DB_HOST
- DB_PORT
- DB_AUTH
- LOGLEVEL (default: "debug")
- SECRET
```

## Create GeoIndex in Redis

```
FT.CREATE geoIdx ON JSON SCHEMA $.geoIndex AS geoIndex GEO
```

## Example Usage:

```
FT.search geoIdx "@geoIndex:[1.0 1.0 157.277 km]"
```

## Run Test

```
npm run test
```

## TODO:

- [ ] Redis Auth
- [x] Proper Reconnection to Redis
- [x] Check for proper authorization for /user/ GET requests
- [ ] Proper types everywhere
- [ ] Tests
- [ ] clear TODOS from source
