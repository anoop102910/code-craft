import pkg from "pg";
const { Pool } = pkg;

export class DbConnection {
  poolInstance; // Explicitly define the type of poolInstance

  constructor() {
    const dbParams = {
      user: "postgres",
      host: "localhost",
      database: "bugsmash",
      password: "sahib bandgi",
      port: 5432,
    };
  
    this.poolInstance = new Pool(dbParams);
  }

  getDbConnection() {
    return this.poolInstance; 
  }
}
