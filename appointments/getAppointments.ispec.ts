process.env.POSTGRES_USER = "user";
process.env.POSTGRES_PASSWORD = "password";
process.env.POSTGRES_LOCAL_PORT = "5432";
process.env.POSTGRES_DB = "db";

import { GraphQLClient, gql, request } from "graphql-request";

const ENDPOINT = "http://192.168.0.37:20002/graphql";

const QUERY = gql`
  query GetAppointments(
    $fromDateTime: AWSDateTime
    $toDateTime: AWSDateTime
    $specialisms: [Specialism!]
    $type: Type
  ) {
    getAppointments(
      fromDateTime: $fromDateTime
      toDateTime: $toDateTime
      specialisms: $specialisms
      type: $type
    ) {
      therapistName
      duration
      startDateTime
      type
    }
  }
`;

const client = new GraphQLClient(ENDPOINT, {
  headers: { "X-API-KEY": "0123456789" },
});

describe("getAppointments - integration test", () => {
  it("should return all appointments when no parameters supplied", async () => {
    const result = await client.request(QUERY, {});
    expect(result.getAppointments).toHaveLength(77);
  });

  it("should correctly filter by dates", async () => {
    const result = await client.request(QUERY, {
      fromDateTime: "2022-01-31T09:00:00.000Z",
      toDateTime: "2022-01-31T10:30:00.000Z",
    });
    expect(result).toEqual({
      getAppointments: [
        {
          therapistName: "Annie Aardvark",
          duration: 30,
          startDateTime: "2022-01-31T09:00:00.000Z",
          type: "oneoff",
        },
        {
          therapistName: "Annie Aardvark",
          duration: 30,
          startDateTime: "2022-01-31T09:30:00.000Z",
          type: "oneoff",
        },
        {
          therapistName: "Annie Aardvark",
          duration: 30,
          startDateTime: "2022-01-31T10:00:00.000Z",
          type: "oneoff",
        },
        {
          therapistName: "Betty Badger",
          duration: 60,
          startDateTime: "2022-01-31T09:00:00.000Z",
          type: "consultation",
        },
      ],
    });
  });

  it("should correctly filter by type", async () => {
    const result = await client.request(QUERY, {
      fromDateTime: "2022-01-31T09:00:00.000Z",
      toDateTime: "2022-01-31T10:30:00.000Z",
      type: "consultation",
    });
    expect(result).toEqual({
      getAppointments: [
        {
          therapistName: "Betty Badger",
          duration: 60,
          startDateTime: "2022-01-31T09:00:00.000Z",
          type: "consultation",
        },
      ],
    });
  });

  it("should correctly filter by specialisms", async () => {
    const result = await client.request(QUERY, {
      fromDateTime: "2022-01-31T09:00:00.000Z",
      toDateTime: "2022-01-31T10:30:00.000Z",
      specialisms: ["ADHD"],
    });
    expect(result).toEqual({
      getAppointments: [
        {
          duration: 60,
          startDateTime: "2022-01-31T09:00:00.000Z",
          therapistName: "Betty Badger",
          type: "consultation",
        },
      ],
    });
  });

  it("should return therapistUuid if requested", async () => {
    const result = await client.request(
      gql`
        query GetAppointments(
          $fromDateTime: AWSDateTime
          $toDateTime: AWSDateTime
          $specialisms: [Specialism!]
          $type: Type
        ) {
          getAppointments(
            fromDateTime: $fromDateTime
            toDateTime: $toDateTime
            specialisms: $specialisms
            type: $type
          ) {
            therapistName
            duration
            startDateTime
            type
            therapistUuid
          }
        }
      `,
      {
        fromDateTime: "2022-01-31T09:00:00.000Z",
        toDateTime: "2022-01-31T10:30:00.000Z",
        type: "consultation",
      }
    );
    expect(result).toEqual({
      getAppointments: [
        {
          therapistName: "Betty Badger",
          duration: 60,
          startDateTime: "2022-01-31T09:00:00.000Z",
          type: "consultation",
          therapistUuid: "2839cee5-8bd4-45a6-b289-fa8435d6673b",
        },
      ],
    });
  });

  it("should fail if the user is not authenticated", async () => {
    await expect(request(ENDPOINT, QUERY)).rejects.toThrow(
      "UnauthorizedException: Missing authorization"
    );
  });
});
