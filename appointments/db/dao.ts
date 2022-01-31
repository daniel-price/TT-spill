import client from "./db";
import { Specialism, Type } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * This file encapsulates retrieving data from the database so that the application layer
 * doesn't need to know the database details.
 * Uses 'knex' to build more complex queries - the SQL it generates can be contract tested in unit tests,
 * and fully tested through integration tests
 */

export async function retrieveAppointments(
  fromDateTime?: string,
  toDateTime?: string,
  type?: string,
  specialisms?: Specialism[]
) {
  const query = client("appointment")
    .join("therapist", "appointment.therapist_uuid", "therapist.uuid")
    .select(
      "therapist.name",
      "appointment.start_datetime",
      "appointment.end_datetime",
      "appointment.type",
      "appointment.therapist_uuid"
    );

  if (specialisms) {
    specialisms.forEach((specialism) => {
      query.whereExists(function () {
        this.select(1)
          .from("therapist_specialism")
          .where("therapist_specialism.type", specialism)
          .whereRaw("therapist_specialism.therapist_uuid = therapist.uuid");
      });
    });
  }

  if (fromDateTime) {
    query.where("appointment.start_datetime", ">=", fromDateTime);
  }

  if (toDateTime) {
    query.where("appointment.end_datetime", "<=", toDateTime);
  }

  if (type) {
    query.where("appointment.type", type);
  }

  const res = await query;

  //transform the database object to hide so variable names have correct casing
  return res.map(
    ({ name, start_datetime, end_datetime, type, therapist_uuid }) => {
      const therapistName = name;
      const startDateTime = start_datetime;
      const endDateTime = end_datetime;
      const therapistUuid = therapist_uuid;

      return { therapistName, startDateTime, endDateTime, type, therapistUuid };
    }
  );
}

export async function insertAppointment(
  therapistUuid: string,
  startDateTime: string,
  endDateTime: string,
  type: Type
) {
  try {
    const uuid = uuidv4();
    await client("appointment").insert({
      uuid,
      therapist_uuid: therapistUuid,
      start_datetime: startDateTime,
      end_datetime: endDateTime,
      type,
    });
    return uuid; //return uuid if successful
  } catch (e) {
    console.error(e);
  }
}
