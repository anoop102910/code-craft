import pkg from "pg";
const { Pool } = pkg;

let poolInstance = null;

export function getDbConnection() {
  if (!poolInstance) {
    const dbParams = {
      user: "postgres",
      host: "localhost",
      database: "bugsmash",
      password: "sahib bandgi",
      port: 5432,
    };

    poolInstance = new Pool(dbParams);
    console.log("Connection pool created");
  }

  return poolInstance;
}
