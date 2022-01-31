import { AppSyncResolverHandler } from "aws-lambda";
import { Appointment, QueryGetAppointmentsArgs, Specialism } from "./types";
import { retrieveAppointments } from "./db/dao";

/**
 * The business logic is split into the getAppointments function, so that it can be easily unit tested
 * The appsync handler boilerplate function will be tested through integration testing, to ensure inputs/outputs are correctly
 * handled by Appsync
 */

export const query: AppSyncResolverHandler<
  QueryGetAppointmentsArgs,
  Appointment[]
> = async (event) => {
  const { fromDateTime, toDateTime, type, specialisms } = event.arguments;

  return getAppointments(fromDateTime, toDateTime, type, specialisms);
};

export async function getAppointments(
  fromDateTime?: string,
  toDateTime?: string,
  type?: string,
  specialisms?: Specialism[]
) {
  const appointments = await retrieveAppointments(
    fromDateTime,
    toDateTime,
    type,
    specialisms
  );

  //transform the data into the format expected by graphql
  return appointments.map(
    ({ therapistName, startDateTime, endDateTime, type, therapistUuid }) => {
      const duration = Math.floor((endDateTime - startDateTime) / 60000);

      return { therapistName, startDateTime, duration, type, therapistUuid };
    }
  );
}
