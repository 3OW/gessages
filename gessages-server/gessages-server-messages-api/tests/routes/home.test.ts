import { build } from "../helper";
import { DEFAULT_PORT } from "../../src/config";

const Port = process.env.PORT || DEFAULT_PORT;
describe("home route test", () => {
  const app = build();

  test("default root route", async () => {
    const res = await app.inject({
      url: "/",
    });
    expect(res.payload).toEqual(`Up and running on Port ${Port}`);
  });
});
