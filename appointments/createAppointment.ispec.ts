process.env.POSTGRES_USER = "user";
process.env.POSTGRES_PASSWORD = "password";
process.env.POSTGRES_LOCAL_PORT = "5432";
process.env.POSTGRES_DB = "db";

import { GraphQLClient, gql, request } from "graphql-request";
import { Type } from "./types";
import db from "./db/db";

const ENDPOINT = "http://192.168.0.37:20002/graphql";

const MUTATION = gql`
  mutation CreateAppointment(
    $therapistUuid: String!
    $startDateTime: AWSDateTime!
    $endDateTime: AWSDateTime!
    $type: Type!
  ) {
    createAppointment(
      therapistUuid: $therapistUuid
      startDateTime: $startDateTime
      endDateTime: $endDateTime
      type: $type
    )
  }
`;

const client = new GraphQLClient(ENDPOINT, {
  headers: { "X-API-KEY": "0123456789" },
});

describe("createAppointment - integration test", () => {
  afterAll(() => {
    db.destroy();
  });
  it("should return a uuid if the appointment has been created", async () => {
    const result = await client.request(MUTATION, {
      therapistUuid: "2839cee5-8bd4-45a6-b289-fa8435d6673a",
      startDateTime: "2021-01-31T09:00:00.000Z",
      endDateTime: "2021-01-31T10:00:00.000Z",
      type: Type.Oneoff,
    });

    const uuid = result.createAppointment;

    expect(uuid).not.toBeFalsy();

    await db("appointment").select("*").where("uuid", uuid);

    await db("appointment").where("uuid", uuid).del();
  });

  it("should not return a uuid if the appointment has not been created", async () => {
    const result = await client.request(MUTATION, {
      therapistUuid: "2839cee5-8bd4-45a6-b289-fa8435d6fake", // not a real therapist uuid
      startDateTime: "2021-01-31T09:00:00.000Z",
      endDateTime: "2021-01-31T10:00:00.000Z",
      type: Type.Oneoff,
    });

    const uuid = result.createAppointment;

    expect(uuid).toBeFalsy();
  });

  it("should fail if the user is not authenticated", async () => {
    await expect(request(ENDPOINT, MUTATION)).rejects.toThrow(
      "UnauthorizedException: Missing authorization"
    );
  });
});
