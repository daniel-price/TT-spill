## Backend Tech Test

An API to retrieve and filter appointments.

## Requirements

Docker must be installed to run a local postgres db for local testing and integration testing.

## Design

I solved the challenge using AWS components, which are defined using Serverless, and can be run locally.

The solution consists of a postgres db (dockerized), a graphql query (and mutation to add more appointments) and lambdas to handle the queries.

I used Node/TS and jest for testing.

## Project structure

Root folder holds general dev tools configuration files (husky, eslint, prettier).

`db` folder holds posgres init script and test data.

`appointments` folder holds a serverless stack with graphql and lambda code.

## Tech

`graphql-codegen` is used to generate types from the graphql schema.

`knex` is used for creating sql queries.

## Running project

`yarn` to install.

`yarn db` to start PostgreSql db.

`yarn generate` to generate types from graphql schema.

`yarn dev` to run serverless offline.

`yarn test` to run unit tests.

`yarn integration` to run integration tests (local database must be running).

## Next steps

- The query and the mutation should require different authorizations. This could be achieved by using cognito user pools for authorization rather than an API key.
- Possibly want an easier way to add appointments in bulk e.g. 8x 1 hour slots between 9 and 5 with an hour lunch.
- Monitoring and alerting could be added through AWS CloudWatch metrics and alerts on the graphql and lambda components.
- Should add input validation for creating appointments.
- Should add more more database constraints to ensure data integrity (e.g. not allowing overlapping appointments for a therapist).

## DB Schema

Therapist

- Id
- Name

Therapist specialisms

- Id
- TherapistId
- Type (enum: addiction, ADHD, CBT, divorce, sexuality)
  - I've assumed this won't change often, if we expect to add more we could move this to a reference table instead

Appointment

- Id
- TherapistId
- StartTime
- EndTime - start/end time makes it easier to filter results by time
- Type (flag: one off or consultation)
  - I've assumed its enough to know which it is; could also instead point to a Consultation table which groups a number of appointments into a consultation
  - Could also use an integer column and bitwise operations to set different specialisms on the therapist table direcly
