import { AppSyncResolverHandler } from "aws-lambda";
import { insertAppointment } from "./db/dao";
import { MutationCreateAppointmentArgs, Type } from "./types";

/**
 * The business logic is split into the createAppointment function, so that it can be easily unit tested
 * The appsync handler boilerplate function will be tested through integration testing, to ensure inputs/outputs are correctly
 * handled by Appsync
 */

export const mutation: AppSyncResolverHandler<
  MutationCreateAppointmentArgs,
  string
> = async (event) => {
  const { therapistUuid, startDateTime, endDateTime, type } = event.arguments;

  const response = await createAppointment(
    therapistUuid,
    startDateTime,
    endDateTime,
    type
  );
  return response;
};

export async function createAppointment(
  therapistUuid: string,
  startDateTime: string,
  endDateTime: string,
  type: Type
) {
  return await insertAppointment(
    therapistUuid,
    startDateTime,
    endDateTime,
    type
  );
}
