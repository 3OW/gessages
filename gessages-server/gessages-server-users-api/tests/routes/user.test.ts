import { build } from "../helper";

describe("User", () => {
  const app = build();

  const jwt = "";

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

  const user = "testUser";

  // User must be present for further tests
  test("Create User Succesfully", async () => {
    const res = await app.inject({
      url: "/signup/",
      method: "POST",
      payload: goodPayload,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.json().id).toMatch("testUser");
  });

  test("GET User successfully", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.ArhP9TMeiR0Kqq57nuNeA2yDLtpW4Q8jE5i4pRx18XIawIxLDEszZlfza_QhuIergFIIusecr2I4BzDLvyH8-w",
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json().userName).toMatch("Bob");
  });

  test("GET User autch check", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjk5OTk5OTk5OTl9.vIgb5A34VeOZSGqLJFTuqwqyUhsmouzIYPKaY8a0ObsEaQIAQhU69QXqxGmF_c9JFVq1NHf1mp9or4rlF-c9HA",
      },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.json().error).toMatch("not authorized");
  });

  test("GET User JWT verify error", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.Wn2BfN6qgiobHUPpCLHfcPmMDG0jLaYIhw_-EIsam_-fFqOQAoU3QvskTw5cPKypqLxJCwFPvptgFicO4e263g",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("UPDATE User Succesfully", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "PUT",
      payload: { userName: "Alice", password: "foo1234bar" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.ArhP9TMeiR0Kqq57nuNeA2yDLtpW4Q8jE5i4pRx18XIawIxLDEszZlfza_QhuIergFIIusecr2I4BzDLvyH8-w",
      },
    });
    expect(res.statusCode).toEqual(200);
    expect(res.json().id).toMatch("testUser");
  });

  test("UPDATE User autch check", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "PUT",
      payload: { userName: "Alice", password: "foo1234bar" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjk5OTk5OTk5OTl9.vIgb5A34VeOZSGqLJFTuqwqyUhsmouzIYPKaY8a0ObsEaQIAQhU69QXqxGmF_c9JFVq1NHf1mp9or4rlF-c9HA",
      },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.json().error).toMatch("not authorized");
  });

  test("UPDATE User JWT verify error", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "PUT",
      payload: { userName: "Alice", password: "foo1234bar" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.Wn2BfN6qgiobHUPpCLHfcPmMDG0jLaYIhw_-EIsam_-fFqOQAoU3QvskTw5cPKypqLxJCwFPvptgFicO4e263g",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("DELETE User autch check", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlcjIiLCJhdWQiOiJ1c2VyIiwiaXNzIjoiZ2Vzc2FnZXMudGxkIiwiaWF0IjoxNjYzNTg1ODczLCJleHAiOjk5OTk5OTk5OTl9.vIgb5A34VeOZSGqLJFTuqwqyUhsmouzIYPKaY8a0ObsEaQIAQhU69QXqxGmF_c9JFVq1NHf1mp9or4rlF-c9HA",
      },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.json().error).toMatch("not authorized");
  });

  test("DELETE User JWT verify error", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.Wn2BfN6qgiobHUPpCLHfcPmMDG0jLaYIhw_-EIsam_-fFqOQAoU3QvskTw5cPKypqLxJCwFPvptgFicO4e263g",
      },
    });
    expect(res.statusCode).toEqual(500);
    expect(res.json().error).toMatch("jwt verify error");
  });

  test("DELETE User Sucessfully", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.ArhP9TMeiR0Kqq57nuNeA2yDLtpW4Q8jE5i4pRx18XIawIxLDEszZlfza_QhuIergFIIusecr2I4BzDLvyH8-w",
      },
    });
    expect(res.statusCode).toEqual(200);
  });

  test("DELETE User ERROR NOT FOUND", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.ArhP9TMeiR0Kqq57nuNeA2yDLtpW4Q8jE5i4pRx18XIawIxLDEszZlfza_QhuIergFIIusecr2I4BzDLvyH8-w",
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res.json().error).toMatch("user not found");
  });

  test("GET User ERROR NOT FOUND", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.ArhP9TMeiR0Kqq57nuNeA2yDLtpW4Q8jE5i4pRx18XIawIxLDEszZlfza_QhuIergFIIusecr2I4BzDLvyH8-w",
      },
    });
    expect(res.statusCode).toEqual(404);
    expect(res.json().error).toMatch("user not found");
  });

  test("UPDATE User ERROR NOT FOUND", async () => {
    const res = await app.inject({
      url: `/user/${user}`,
      method: "PUT",
      payload: { userName: "Alice", password: "foo1234bar" },
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0VXNlciIsImF1ZCI6InVzZXIiLCJpc3MiOiJnZXNzYWdlcy50bGQiLCJpYXQiOjE2NjM1ODU4NzMsImV4cCI6OTk5OTk5OTk5OX0.ArhP9TMeiR0Kqq57nuNeA2yDLtpW4Q8jE5i4pRx18XIawIxLDEszZlfza_QhuIergFIIusecr2I4BzDLvyH8-w",
      },
    });
    expect(res.statusCode).toEqual(403);
    expect(res.json().error).toMatch("user doesn't exists");
  });
});
