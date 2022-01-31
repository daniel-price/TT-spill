import { retrieveAppointments } from "./dao";
import mockKnex from "mock-knex";
import db from "./db";
import { Specialism, Type } from "../types";

jest.mock("../env", () => {
  return {}; //to prevent errors from the env variables not being set during tests
});

mockKnex.mock(db);
const tracker = mockKnex.getTracker();

/**
 * This contract tests the different combinations of sql queries which can run, so that any changes to the sql can be found and checked before integration testing.
 * The mockKnex package allows us to see what queries and parameters are run on the db, and we check those match the expected values
 * NOTE: this doesn't actual test that the queries are valid or work as expected, just that they haven't changed - that will be tested by integration tests
 */
describe("retrieveAppointments", () => {
  beforeEach(() => {
    tracker.install();
  });

  afterEach(() => {
    tracker.uninstall();
  });

  it("should generate query when no parameters supplied", async () => {
    const queryPromise = waitForQuery();
    await retrieveAppointments();
    const { sql, bindings } = await queryPromise;
    expect(sql).toEqual(
      'select "therapist"."name", "appointment"."start_datetime", "appointment"."end_datetime", "appointment"."type", "appointment"."therapist_uuid" from "appointment" inner join "therapist" on "appointment"."therapist_uuid" = "therapist"."uuid"'
    );
    expect(bindings).toEqual([]);
  });

  it("should generate query when only fromDateTime supplied", async () => {
    const queryPromise = waitForQuery();
    await retrieveAppointments("2022-01-31T09:00:00.000Z");
    const { sql, bindings } = await queryPromise;
    expect(sql).toEqual(
      'select "therapist"."name", "appointment"."start_datetime", "appointment"."end_datetime", "appointment"."type", "appointment"."therapist_uuid" from "appointment" inner join "therapist" on "appointment"."therapist_uuid" = "therapist"."uuid" where "appointment"."start_datetime" >= $1'
    );
    expect(bindings).toEqual(["2022-01-31T09:00:00.000Z"]);
  });

  it("should generate query when only toDateTime supplied", async () => {
    const queryPromise = waitForQuery();
    await retrieveAppointments(undefined, "2022-02-01T09:00:00.000Z");
    const { sql, bindings } = await queryPromise;
    expect(sql).toEqual(
      'select "therapist"."name", "appointment"."start_datetime", "appointment"."end_datetime", "appointment"."type", "appointment"."therapist_uuid" from "appointment" inner join "therapist" on "appointment"."therapist_uuid" = "therapist"."uuid" where "appointment"."end_datetime" <= $1'
    );
    expect(bindings).toEqual(["2022-02-01T09:00:00.000Z"]);
  });

  it("should generate query when only type supplied", async () => {
    const queryPromise = waitForQuery();
    await retrieveAppointments(undefined, undefined, Type.Oneoff);
    const { sql, bindings } = await queryPromise;
    expect(sql).toEqual(
      'select "therapist"."name", "appointment"."start_datetime", "appointment"."end_datetime", "appointment"."type", "appointment"."therapist_uuid" from "appointment" inner join "therapist" on "appointment"."therapist_uuid" = "therapist"."uuid" where "appointment"."type" = $1'
    );
    expect(bindings).toEqual(["oneoff"]);
  });

  it("should generate query when only specialism supplied", async () => {
    const queryPromise = waitForQuery();
    await retrieveAppointments(undefined, undefined, undefined, [
      Specialism.Adhd,
      Specialism.Addiction,
    ]);
    const { sql, bindings } = await queryPromise;
    expect(sql).toEqual(
      'select "therapist"."name", "appointment"."start_datetime", "appointment"."end_datetime", "appointment"."type", "appointment"."therapist_uuid" from "appointment" inner join "therapist" on "appointment"."therapist_uuid" = "therapist"."uuid" where exists (select 1 from "therapist_specialism" where "therapist_specialism"."type" = $1 and therapist_specialism.therapist_uuid = therapist.uuid) and exists (select 1 from "therapist_specialism" where "therapist_specialism"."type" = $2 and therapist_specialism.therapist_uuid = therapist.uuid)'
    );
    expect(bindings).toEqual(["ADHD", "addiction"]);
  });

  it("should generate query when all parameters supplied", async () => {
    const queryPromise = waitForQuery();
    await retrieveAppointments(
      "2022-01-31T09:00:00.000Z",
      "2022-02-01T09:00:00.000Z",
      Type.Oneoff,
      [Specialism.Adhd, Specialism.Addiction]
    );
    const { sql, bindings } = await queryPromise;
    expect(sql).toEqual(
      'select "therapist"."name", "appointment"."start_datetime", "appointment"."end_datetime", "appointment"."type", "appointment"."therapist_uuid" from "appointment" inner join "therapist" on "appointment"."therapist_uuid" = "therapist"."uuid" where exists (select 1 from "therapist_specialism" where "therapist_specialism"."type" = $1 and therapist_specialism.therapist_uuid = therapist.uuid) and exists (select 1 from "therapist_specialism" where "therapist_specialism"."type" = $2 and therapist_specialism.therapist_uuid = therapist.uuid) and "appointment"."start_datetime" >= $3 and "appointment"."end_datetime" <= $4 and "appointment"."type" = $5'
    );
    expect(bindings).toEqual([
      "ADHD",
      "addiction",
      "2022-01-31T09:00:00.000Z",
      "2022-02-01T09:00:00.000Z",
      "oneoff",
    ]);
  });

  it("should convert the results so the names have the correct casing", async () => {
    tracker.on("query", (query) => {
      query.response([
        {
          name: "Annie Aardvark",
          start_datetime: "2022-01-31T09:00:00.000Z",
          end_datetime: "2022-01-31T09:03:00.000Z",
          type: "oneoff",
        },
      ]);
    });
    const results = await retrieveAppointments();
    expect(results).toEqual([
      {
        endDateTime: "2022-01-31T09:03:00.000Z",
        startDateTime: "2022-01-31T09:00:00.000Z",
        therapistName: "Annie Aardvark",
        type: "oneoff",
      },
    ]);
  });
});

/**
 * Helper function which returns a promise which resolves to the sql and bindings for the next sql query
 */
async function waitForQuery() {
  let promiseResolve: {
    (arg: { sql: string; bindings: string[] }): void;
  };
  const promise = new Promise<{ sql: string; bindings: string[] }>(
    (resolve) => (promiseResolve = resolve)
  );
  tracker.on("query", (query) => {
    query.response([]);
    const { sql, bindings } = query;
    promiseResolve({ sql, bindings });
  });

  return promise;
}
