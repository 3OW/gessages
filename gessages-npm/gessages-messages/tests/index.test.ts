import * as messages from "../src/index";

//TODO write more tests (auth etc...)
describe("Messages", () => {
  const host = "http://localhost:3000";
  const badHost = "http://localhost:22";

  let postedThread = <messages.ThreadIdType>"thd-111111111111111111111";
  let postedMessage = <messages.MessageIdType>"msg-111111111111111111111";
  const jwt =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6MTk5OTk5OTk5OX0.43Bakxo2LJFcp73Vv55hJQkJUDKS3OpKC0Z465FP4uTGbTwTtLlO0DWJSvBfRa-d2UsppuN3zCeeDbVgeNuEpQ";

  const goodPayload = {
    userId: "testUser",
    userName: "Bob",
    userLogo: "/path/to/logo.png",
    zoneId: null,
    location: {
      lon: 13.41053,
      lat: 52.52437,
      timestamp: 1632785619827,
    },
    message: "Hello World",
    images: null,
  };

  test("POST Thread Succesfully", async () => {
    const res = <Partial<messages.Thread>>(
      await messages.postThread(host, goodPayload, jwt)
    );
    expect(res.id).toMatch(/^thd-/);
    expect(res.id).toHaveLength(25);
    postedThread = <messages.ThreadIdType>res.id;
  });

  test("POST Thread bad host", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.postThread(badHost, goodPayload, jwt)
    );
    expect(err.errortype).toMatch("ECONNREFUSED");
  });

  const badPayload = {
    userId: "1",
    userName: "Bob2",
    userLogo: "/path/to/logo.png",
    zoneId: null,
    location: { lon: 0.23, lat: 0.231, timestamp: 1 },
    message: "Hello World",
    images: null,
  };

  test("POST Thread bad Payload", async () => {
    const err = <messages.ApiError>(
      await messages.postThread(host, badPayload, jwt)
    );
    expect(err.statusCode).toEqual(400);
    expect(err.errortype).toMatch("Bad Request");
  });

  test("GET Thread Succesfully", async () => {
    const res = <Partial<messages.Thread>>(
      await messages.getThreadById(host, postedThread, jwt)
    );
    expect(res.id).toMatch(/^thd-/);
    expect(res.userId).toEqual("testUser");
  });

  test("GET Thread NOT FOUND", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.getThreadById(host, "thd-111111111111111111111", jwt)
    );
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toEqual("Not Found");
  });

  test("GET Thread wrong threadId length", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.getThreadById(host, "thd-1111111111111111111111", jwt)
    );
    expect(err.statusCode).toEqual(400);
    expect(err.errortype).toMatch("Bad Request");
  });

  test("PUT Thread Succesfully", async () => {
    const res = await (<Partial<messages.Thread>>(
      messages.updateThread(host, postedThread, { message: "Bye World!" }, jwt)
    ));
    //console.log(res);
    expect(res.id).toMatch(postedThread);
  });

  test("PUT Thread THREAD NOT FOUND", async () => {
    const err = await (<Partial<messages.ApiError>>(
      messages.updateThread(
        host,
        "thd-111111111111111111111",
        { message: "Bye World!" },
        jwt
      )
    ));
    expect(err.statusCode).toEqual(404);
  });

  test("GET NEAR Threads ALL FOUND", async () => {
    const res = <Partial<messages.ThreadsObject>>(
      await messages.getNearThreadsAll(
        host,
        { lon: 13.41053, lat: 52.52437, rad: 50 },
        jwt
      )
    );
    expect(res[postedThread]?.userId).toMatch("testUser");
  });

  test("GET NEAR Threads SELECT FOUND", async () => {
    const res = <Partial<messages.ThreadsObject>>(
      await messages.getNearThreadsSelect(
        host,
        { lon: 13.41053, lat: 52.52437, rad: 50 },
        jwt
      )
    );
    expect(res[postedThread]?.userId).toMatch("testUser");
  });

  test("GET NEAR Threads ALL NOT FOUND", async () => {
    const res = <Partial<messages.ThreadsObject>>(
      await messages.getNearThreadsAll(
        host,
        { lon: 11, lat: 11, rad: 0.01 },
        jwt
      )
    );
    expect(res).toMatchObject({});
  });

  test("GET NEAR Threads SELECT NOT FOUND", async () => {
    const res = <Partial<messages.ThreadsObject>>(
      await messages.getNearThreadsSelect(
        host,
        { lon: 11, lat: 11, rad: 0.01 },
        jwt
      )
    );
    expect(res).toMatchObject({});
  });

  test("DELETE Thread NOT FOUND", async () => {
    const res = <Partial<messages.ApiError>>(
      await messages.deleteThread(host, "thd-111111111111111111111", jwt)
    );
    expect(res.statusCode).toEqual(404);
    expect(res.errortype).toMatch("Not Found");
  });

  const message = {
    userId: "usr-211111111111111111112",
    userName: "Alice",
    parentId: null,
    threadId: postedThread,
    location: { lon: 0.47, lat: 0.11, timestamp: 1632785619833 },
    message: "Hello",
    images: null,
  };

  test("POST Messsage Succesfully", async () => {
    const res = <Partial<messages.Message>>(
      await messages.postMessage(host, postedThread, message, jwt)
    );
    expect(res.id).toMatch(/^msg-/);
    expect(res.id).toHaveLength(25);
    postedMessage = <messages.MessageIdType>res.id;
  });

  test("POST 2nd Messsage Succesfully", async () => {
    const res = <Partial<messages.Message>>(
      await messages.postMessage(host, postedThread, message, jwt)
    );
    expect(res.id).toMatch(/^msg-/);
    expect(res.id).toHaveLength(25);
    expect(res.id).not.toEqual(postedMessage);
  });

  test("POST Message to nonexistent Thread", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.postMessage(
        host,
        "thd-111111111111111111111",
        message,
        jwt
      )
    );
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toMatch("Not Found");
  });

  test("GET Message", async () => {
    const res = <Partial<messages.Message>>(
      await messages.getMessage(host, postedThread, postedMessage, jwt)
    );
    expect(res.id).toMatch(postedMessage);
    expect(res.userId).toMatch("testUser");
  });

  test("GET Message NOT FOUND cause thread not found", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.getMessage(
        host,
        "thd-111111111111111111111",
        postedMessage,
        jwt
      )
    );
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toMatch("Not Found");
  });

  test("GET Message NOT FOUND cause message not found", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.getMessage(
        host,
        postedThread,
        "msg-111111111111111111111",
        jwt
      )
    );
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toMatch("Not Found");
  });

  test("PUT message Succesfully", async () => {
    const res = await (<Partial<messages.Message>>(
      messages.updateMessage(
        host,
        postedThread,
        postedMessage,
        { message: "Bye!" },
        jwt
      )
    ));
    expect(res.id).toMatch(postedMessage);
  });

  test("PUT message FAILS cause thread doesn't exist", async () => {
    const err = await (<Partial<messages.ApiError>>(
      messages.updateMessage(
        host,
        "thd-111111111111111111111",
        postedMessage,
        { message: "Bye!" },
        jwt
      )
    ));
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toMatch("Not Found");
  });

  test("PUT message FAILS cause message doesn't exist", async () => {
    const err = await (<Partial<messages.ApiError>>(
      messages.updateMessage(
        host,
        postedThread,
        "msg-111111111111111111111",
        { message: "Bye!" },
        jwt
      )
    ));
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toMatch("Not Found");
  });

  test("DELETE message NOT FOUND", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.deleteMessage(
        host,
        postedThread,
        "msg-111111111111111111111",
        jwt
      )
    );
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toMatch("Not Found");
  });

  test("DELETE message NOT FOUND cause thread not found", async () => {
    const err = <Partial<messages.ApiError>>(
      await messages.deleteMessage(
        host,
        "thd-111111111111111111111",
        postedMessage,
        jwt
      )
    );
    expect(err.statusCode).toEqual(404);
    expect(err.errortype).toMatch("Not Found");
  });

  test("DELETE message Successfully", async () => {
    const res = <Partial<messages.StatusMessage>>(
      await messages.deleteMessage(host, postedThread, postedMessage, jwt)
    );
    expect(res.status).toMatch("success");
  });

  test("DELETE Thread Successfully", async () => {
    const res = <Partial<messages.StatusMessage>>(
      await messages.deleteThread(host, postedThread, jwt)
    );
    expect(res.status).toMatch("success");
  });
});
