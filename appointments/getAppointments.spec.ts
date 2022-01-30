import { getAppointments } from "./getAppointments";
import mockKnex from "mock-knex";
import db from "./db/db";

jest.mock("./env", () => {
  return {}; //to prevent errors from the env variables not being set during tests
});

mockKnex.mock(db);
const tracker = mockKnex.getTracker();
tracker.install();

tracker.on("query", (query) => {
  query.response([
    {
      name: "Annie Aardvark",
      start_datetime: new Date("2022-01-31T09:00:00.000Z"),
      end_datetime: new Date("2022-01-31T09:30:00.000Z"),
      type: "oneoff",
    },
  ]);
});

describe("getAppointments", () => {
  it("should calculate duration and return correct values", async () => {
    const results = await getAppointments();
    expect(results).toEqual([
      {
        duration: 30,
        startDateTime: new Date("2022-01-31T09:00:00.000Z"),
        therapistName: "Annie Aardvark",
        type: "oneoff",
      },
    ]);
  });
});
