# messages NPM package

This packages can be used to access the gessages users API

## Example usage:

```
import {getUserById } from "gessages-users"

const host = "http://localhost:3000";
const jwt =  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ";
(async()=>{
   console.log(await getUserById(host, "Alice", jwt))
 })();
```
