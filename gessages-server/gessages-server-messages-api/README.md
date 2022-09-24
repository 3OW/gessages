## Docker

```
docker build . -t <tag>/messages-api
```

### Available environment variables:

see config.ts for explanations

```
- PORT    (default: 3002)
- DB_HOST
- DB_PORT
- DB_AUTH
- LOGLEVEL (default: "debug")
- MSG_MIN_LENGTH
- MSG_MAX_LENGTH
- THD_TITLE_LENGTH
- THREAD_EXPIRE
- MAX_GEO_RESULTS
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
- [x] SET GEOINDEX in Redis
- [x] Tests
- [ ] Proper types everywhere
