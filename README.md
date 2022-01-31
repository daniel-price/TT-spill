## Backend Tech Test

An API to retrieve and filter appointments.

## Requirements

- Docker

## Project setup

Root folder holds general dev tools configuration files (husky, eslint, prettier).

`yarn` to install
`yarn db` to start PostgreSql db
`yarn generate` to generate types from graphql schema
`yarn dev` to run serverless offline
`yarn test` to run unit tests
`yarn integration` to run integration tests (local database must be running)

## Initial design thoughts

- Implement using serverless framework, enabling this to be run locally.
- Have an 'appointments' stack, and more stacks can be added as the project grows.
- PostgreSql database - dockerize for this task.
- GraphQL API with a query to find appointments and a mutation to add more slots.
- Can use authentication/authorization tools built into AppSync.
- Use a lambda resolver to actually query/update the database.
- Lambda written in NodeJS/Typescript

## Task breakdown

- Set up PostgreSql db, schema, data, queries and indexes
- Add serverless and appointments stack
- Add simple GraphQL API (no auth) with getAppointments query and lambda which returns mock results
- Connect lambda with PostgreSql to return proper database
- Add mutation to add more appointment slots
- Optimize queries with indexes (doing at this point so I can generate lots of data to check query times)
- Add authentication/authorization

## DB Schema plan

- Therapist
  - Id
  - Name
- Therapist specialisms
  - Id
  - TherapistId
  - Type (enum: addiction, ADHD, CBT, divorce, sexuality)
    - I've assumed this won't change often, if we expect to add more we could move this to a reference table instead
- Appointment
  - Id
  - TherapistId
  - ~Time~ StartTime
  - ~Duration~ EndTime - start/end time makes it easier to filter results by time
  - Type (flag: one off or consultation)
    - I've assumed its enough to know which it is; could also instead point to a Consultation table which groups a number of appointments into a consultation
