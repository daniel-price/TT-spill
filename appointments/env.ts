require("dotenv").config({ path: "../.env" });

function string(varName: string) {
  const value = process.env[varName];
  if (!value) throw new Error(`${varName} env var not set`);
  return value;
}

function int(varName: string) {
  const value = process.env[varName];
  if (!value) throw new Error(`${varName} env var not set`);
  const int = Number.parseInt(value);
  if (isNaN(int)) {
    throw new Error(
      `${varName} env var has value ${value} but should be an int`
    );
  }
  return int;
}

export default {
  POSTGRES_USER: string("POSTGRES_USER"),
  POSTGRES_PASSWORD: string("POSTGRES_PASSWORD"),
  POSTGRES_LOCAL_PORT: int("POSTGRES_LOCAL_PORT"),
  POSTGRES_DB: string("POSTGRES_DB"),
};
