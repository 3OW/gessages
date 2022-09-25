import * as users from "../src/index";

//TODO write more tests (auth etc...)
describe("Users", () => {
  const host = "http://localhost:3000";
  const badHost = "http://localhost:22";

  const createdUser = <users.UserIdType>"Test1234";

  let jwt = "";

  const goodPayload = {
    id: "testUser1",
    userName: "Bob",
    password: "foo1234bar",
    userLogo: "/path/to/logo.png",
    location: {
      lon: 13.41053,
      lat: 52.52437,
      timestamp: 1632785619827,
    },
  };

  const goodCreds = {
    id: "testUser1",
    password: "foo1234bar",
  };

  const badCreds = {
    id: "testUser1",
    password: "bar1234foo",
  };

  test("Create user succesfully", async () => {
    const res = <Partial<users.User>>await users.createUser(host, goodPayload);
    expect(res.id).toMatch("testUser1");
  });

  test("Don't allow to create existing users twice", async () => {
    const res = <Partial<users.ApiError>>(
      await users.createUser(host, goodPayload)
    );
    expect(res.statusCode).toEqual(409);
    expect(res.message).toMatch("user already exists");
  });

  test("Create user bad host", async () => {
    const err = <Partial<users.ApiError>>(
      await users.createUser(badHost, goodPayload)
    );
    expect(err.errortype).toMatch("ECONNREFUSED");
  });

  test("SignIn succesfully", async () => {
    const res = <users.AuthResponse>await users.signIn(host, goodCreds);
    expect(res.auth).toBeTruthy;
    expect(typeof res.jwt).toBe("string");
    jwt = res.jwt;
  });

  test("SignIn bad pass", async () => {
    const res = <Partial<users.AuthResponse & users.ApiError>>(
      await users.signIn(host, badCreds)
    );
    expect(res.statusCode).toEqual(403);
  });

  test("Update user succesfully", async () => {
    const res = <Partial<users.User>>(
      await users.updateUser(host, goodPayload.id, { userName: "Alice" }, jwt)
    );
    expect(res.id).toMatch("testUser1");
  });

  test("Update user not authorized", async () => {
    const res = <Partial<users.ApiError>>(
      await users.updateUser(host, "testUser11", { userName: "Alice" }, jwt)
    );
    expect(res.statusCode).toEqual(401);
    expect(res.message).toMatch("not authorized");
  });

  test("Get user succesfully", async () => {
    const res = <Partial<users.User>>(
      await users.getUserById(host, goodPayload.id, jwt)
    );
    expect(res.id).toMatch("testUser1");
    expect(res.userName).toMatch("Alice");
  });

  test("Get user not authorized", async () => {
    const res = <Partial<users.ApiError>>(
      await users.getUserById(host, "testUser11", jwt)
    );
    expect(res.statusCode).toEqual(401);
    expect(res.message).toMatch("not authorized");
  });

  test("Delete user not authorized", async () => {
    const res = <Partial<users.ApiError>>(
      await users.deleteUser(host, "testUser11", jwt)
    );
    expect(res.statusCode).toEqual(401);
    expect(res.message).toMatch("not authorized");
  });

  test("Delete user Succesfully", async () => {
    const res = <users.StatusMessage>(
      await users.deleteUser(host, goodPayload.id, jwt)
    );
    expect(res.status).toMatch("success");
  });
});
