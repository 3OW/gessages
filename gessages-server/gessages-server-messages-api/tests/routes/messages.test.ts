import { build } from "../helper";

describe("Messages", () => {
  const app = build();

  let postedThread = "";
  let messageId = "";

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

  const message = {
    userId: "testUser2",
    userName: "Alice",
    parentId: null,
    threadId: postedThread,
    location: {
      lon: 0.47,
      lat: 0.11,
      timestamp: 1632785619833,
    },
    message: "Bye",
    images: null,
  };

  test("Post Message Succesfully", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}`,
      method: "POST",
      payload: message,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(201);
    expect(res.json().id).toMatch(/^msg-/);
    expect(res.json().id).toHaveLength(25);
    messageId = res.json().id;
  });

  test("Post 2nd Message Succesfully", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}`,
      method: "POST",
      payload: message,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(201);
    expect(res.json().id).toMatch(/^msg-/);
    expect(res.json().id).toHaveLength(25);
  });

  test("Post Message JWT without uid", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}`,
      method: "POST",
      payload: message,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.2H1HmklV2Fdpl799ruEpqfrB5-AppVKC1g7P5W0pbmbqeR06gKRFWkhQ3vKFJVtAVHlrmfcAfx51ZaFR0nIkUg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("no userid in JWT");
  });

  test("Post Message JWT outdated", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}`,
      method: "POST",
      payload: message,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTY2MzU4NTg3M30.JOXmktRz1KjmuI7QphtVcOKCPI4bm237C0i4muSExgELM6IY2hNs0r3LvmfxjXcBrnZzF10HcWat_t25FmEjRg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("Post Message to nonexistent Thread", async () => {
    const res = await app.inject({
      url: "/message/thd-111111111111111111111",
      method: "POST",
      payload: message,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res.json().error).toMatch("Thread not found");
  });

  test("GET Message ", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/${messageId}`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json().id).toMatch(messageId);
  });

  test("GET Message NOT FOUND cause thread not found", async () => {
    const res = await app.inject({
      url: `/message/thd-111111111111111111111/${messageId}`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(404);
  });

  test("GET Message NOT FOUND cause message not found", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/msg-111111111111111111111`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(404);
  });

  test("UPDATE Message ", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/${messageId}`,
      method: "PUT",
      payload: { message: "Updated" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json().id).toMatch(messageId);
  });

  test("UPDATE Message outdated JWT ", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/${messageId}`,
      method: "PUT",
      payload: { message: "Updated" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTY2MzU4NTg3M30.JOXmktRz1KjmuI7QphtVcOKCPI4bm237C0i4muSExgELM6IY2hNs0r3LvmfxjXcBrnZzF10HcWat_t25FmEjRg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("UPDATE Message auth check ", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/${messageId}`,
      method: "PUT",
      payload: { message: "Updated" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.json().error).toMatch("not authorized");
  });

  test("UPDATE Message FAILS cause thread doesn't exist", async () => {
    const res = await app.inject({
      url: `/message/thd-111111111111111111111/${messageId}`,
      method: "PUT",
      payload: { message: "Updated" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res.json().error).toMatch("message not found");
  });

  test("UPDATE Message FAILS cause message doesn't exist", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/msg-111111111111111111111`,
      method: "PUT",
      payload: { message: "Updated" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res.json().error).toMatch("message not found");
  });

  test("DELETE Message auth check ", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/${messageId}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.json().error).toMatch("not authorized");
  });

  test("DELETE Message outdated JWT ", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/${messageId}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTY2MzU4NTg3M30.JOXmktRz1KjmuI7QphtVcOKCPI4bm237C0i4muSExgELM6IY2hNs0r3LvmfxjXcBrnZzF10HcWat_t25FmEjRg",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("DELETE Message ", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/${messageId}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json().status).toMatch("success");
  });

  test("DELETE Message NOT FOUND", async () => {
    const res = await app.inject({
      url: `/message/${postedThread}/msg-111111111111111111111`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res.json().error).toMatch("message not found");
  });

  test("DELETE Message NOT FOUND cause thread not found", async () => {
    const res = await app.inject({
      url: `/message/thd-111111111111111111111/${messageId}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjE5OTk5OTk5OTl9.JcCfxAYQpPS7mLgixeycO-igKboJ2o-s1cd60LZCVYbjfEwEhAXWfeGmg1Z2AKJTrjus9KZzIvxGq9LUGvRZag",
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res.json().error).toMatch("message not found");
  });

  test("DELETE Thread Sucessfully", async () => {
    const res = await app.inject({
      url: `/thread/${postedThread}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ",
      },
    });
    expect(res.statusCode).toEqual(200);
  });
});
