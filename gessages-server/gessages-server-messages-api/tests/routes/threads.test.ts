import { build } from "../helper";

describe("Threads", () => {
  const app = build();

  let postedThread = "";

  const goodPayload = {
    userId: "testUser",
    userName: "Bob",
    userLogo: "/path/to/logo.png",
    zoneId: null,
    location: {
      lon: 0.23,
      lat: 0.231,
      timestamp: 1632785619827,
    },
    message: "Hello World",
    images: null,
  };

  test("Post Thread Succesfully", async () => {
    const res = await app.inject({
      url: "/thread/",
      method: "POST",
      payload: goodPayload,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(201);
    expect(res.json().id).toMatch(/^thd-/);
    expect(res.json().id).toHaveLength(25);
    postedThread = res.json().id;
  });

  let badPayload = {
    userId: "usr-111111111111111111111",
    userName: "Bob2",
    userLogo: "/path/to/logo.png",
    zoneId: null,
    location: {
      lon: 0.23,
      lat: 0.231,
      timestamp: 1,
    },
    message: "Hello World",
    images: null,
  };

  test("Check location timestamp", async () => {
    const res = await app.inject({
      url: "/thread/",
      method: "POST",
      payload: badPayload,
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(400);
  });

  badPayload = {
    userId: "usr-111111111111111111111",
    userName: "Bob3",
    userLogo: "/path/to/logo.png",
    zoneId: null,
    location: {
      lon: 222.23,
      lat: 0.231,
      timestamp: 1632785619827,
    },
    message: "Hello World",
    images: null,
  };

  test("Check location lon", async () => {
    const res = await app.inject({
      url: "/thread/",
      method: "POST",
      payload: badPayload,
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(400);
  });

  badPayload = {
    userId: "usr-111111111111111111111",
    userName: "Bob3",
    userLogo: "/path/to/logo.png",
    zoneId: null,
    location: {
      lon: 0.23,
      lat: 222.231,
      timestamp: 1632785619827,
    },
    message: "Hello World",
    images: null,
  };

  test("Check location lat", async () => {
    const res = await app.inject({
      url: "/thread/",
      method: "POST",
      payload: badPayload,
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(400);
  });

  test("POST thread JWT without uid ", async () => {
    const res = await app.inject({
      url: `/thread/`,
      method: "POST",
      payload: goodPayload,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.2H1HmklV2Fdpl799ruEpqfrB5-AppVKC1g7P5W0pbmbqeR06gKRFWkhQ3vKFJVtAVHlrmfcAfx51ZaFR0nIkUg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("no userid in JWT");
  });

  test("POST thread outdated JWT", async () => {
    const res = await app.inject({
      url: `/thread/`,
      method: "POST",
      payload: goodPayload,
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTY2MzU4NTg3M30.JOXmktRz1KjmuI7QphtVcOKCPI4bm237C0i4muSExgELM6IY2hNs0r3LvmfxjXcBrnZzF10HcWat_t25FmEjRg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("GET Thread Wrong ID length", async () => {
    const res = await app.inject({
      url: "/thread/thd-7fSm6JMIQQfUWaB6aAJCQw",
      method: "GET",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(400);
  });

  test("GET Thread Wrong ID length", async () => {
    const res = await app.inject({
      url: "/thread/thd-7fSm6JMIQQfUB6aAJCQw",
      method: "GET",
    });
    expect(res.statusCode).toEqual(400);
  });

  test("GET Thread Wrong ID pattern", async () => {
    const res = await app.inject({
      url: "/thread/whd-7fSm6JMIQQfUWaB6aAJCQ",
      method: "GET",
    });
    expect(res.statusCode).toEqual(400);
  });

  test("GET Thread not found", async () => {
    const res = await app.inject({
      url: "/thread/thd-111111111111111111111",
      method: "GET",
    });
    expect(res.statusCode).toEqual(404);
  });

  test("GET Thread ", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "GET",
    });
    expect(res.statusCode).toEqual(200);
  });

  test("UPDATE Thread ", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "PUT",
      payload: { message: "updated", userId: "foo" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(200);
  });

  test("UPDATE Thread disallow messages", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "PUT",
      payload: {
        messages: { test: "Hello World!2" },
      },
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(405);
  });

  test("UPDATE Thread NOT FOUND", async () => {
    const res = await app.inject({
      url: "/thread/thd-111111111111111111111",
      method: "PUT",
      payload: {
        message: "updated",
      },
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(404);
  });

  test("UPDATE thread outdated JWT", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "PUT",
      payload: goodPayload,
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTY2MzU4NTg3M30.JOXmktRz1KjmuI7QphtVcOKCPI4bm237C0i4muSExgELM6IY2hNs0r3LvmfxjXcBrnZzF10HcWat_t25FmEjRg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("UPDATE thread auth check", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "PUT",
      payload: goodPayload,
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.json().error).toMatch("not authorized");
  });

  test("GET NEAR Threads ALL NOT FOUND", async () => {
    const res = await app.inject({
      url: "/thread/near/10/10/0.01/true",
      method: "GET",
    });
    expect(res.statusCode).toEqual(200);
  });

  test("GET NEAR Threads !ALL NOT FOUND", async () => {
    const res = await app.inject({
      url: "/thread/near/10/10/0.01/false",
      method: "GET",
    });
    expect(res.statusCode).toEqual(200);
  });

  test("GET NEAR Threads ALL FOUND", async () => {
    const res = await app.inject({
      url: "/thread/near/0.23/0.23/50/true",
      method: "GET",
    });
    expect(res.statusCode).toEqual(200);
  });

  test("GET NEAR Threads !ALL FOUND", async () => {
    const res = await app.inject({
      url: "/thread/near/0.23/0.23/50/false",
      method: "GET",
    });
    expect(res.statusCode).toEqual(200);
  });

  test("DELETE thread NOT FOUND", async () => {
    const res = await app.inject({
      url: "/thread/thd-111111111111111111111",
      method: "DELETE",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(404);
  });

  test("DELETE thread auth check ", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.json().error).toMatch("not authorized");
  });

  test("DELETE thread outdated JWT", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "DELETE",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTY2MzU4NTg3M30.JOXmktRz1KjmuI7QphtVcOKCPI4bm237C0i4muSExgELM6IY2hNs0r3LvmfxjXcBrnZzF10HcWat_t25FmEjRg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("DELETE Sucessfully", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "DELETE",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(200);
  });
});
