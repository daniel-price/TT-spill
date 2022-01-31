import env from "../env";
import { Knex, knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    user: env.POSTGRES_USER,
    database: env.POSTGRES_DB,
    password: env.POSTGRES_PASSWORD,
    port: env.POSTGRES_LOCAL_PORT,
  },
};

const knexInstance = knex(config);

export default knexInstance;
