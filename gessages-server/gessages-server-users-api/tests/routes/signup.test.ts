import { build } from "../helper";

describe("SignUp", () => {
  const app = build();

  const goodPayload = {
    id: "testUser",
    userName: "Bob",
    password: "foo1234bar",
    userLogo: "/path/to/logo.png",
    location: {
      lon: 13.41053,
      lat: 52.52437,
      timestamp: 1632785619827,
    },
  };

  test("Create User Succesfully", async () => {
    const res = await app.inject({
      url: "/signup/",
      method: "POST",
      payload: goodPayload,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.json().id).toMatch("testUser");
  });

  test("Don't allow to create existing users twice", async () => {
    const res = await app.inject({
      url: "/signup/",
      method: "POST",
      payload: goodPayload,
    });
    expect(res.statusCode).toEqual(409);
    expect(res.json().error).toMatch("user already exists");
  });

  // must be removed
  test("DELETE User Sucessfully", async () => {
    const res = await app.inject({
      url: "/user/testUser",
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.ArhP9TMeiR0Kqq57nuNeA2yDLtpW4Q8jE5i4pRx18XIawIxLDEszZlfza_QhuIergFIIusecr2I4BzDLvyH8-w",
      },
    });
    expect(res.statusCode).toEqual(200);
  });
});
