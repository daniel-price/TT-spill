## Backend Tech Test

An API to retrieve and filter appointments.

## Project setup

Root folder holds general dev tools configuration files (husky, eslint, prettier).

`yarn` to install

## Initial design thoughts

- Implement using serverless framework, enabling this to be run locally.
- Have an 'appointments' stack, and more stacks can be added as the project grows.
- PostgreSql database - dockerize for this task.
- GraphQL API with a query to find appointments and a mutation to add more slots.
- Can use authentication/authorization tools built into AppSync.
- Use a lambda resolver to actually query/update the database.
- Lambda written in NodeJS/Typescript

## DB Schema plan

- Therapist
  - Id
  - Name
- Therapist specialisms
  - Id
  - TherapistId
  - Type (enum: addiction, ADHD, CBT, divorce, sexuality) - I've assumed this won't change often, if we expect to add more we could move this to a reference table instead
- Appointment
  - Id
  - TherapistId
  - Time
  - Duration
  - Type (flag: one off or consultation) - I've assumed its enough to know which it is; could also instead point to a Consultation table which groups a number of appointments into a consultation
