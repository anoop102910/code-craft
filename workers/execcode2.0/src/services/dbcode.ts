import { DbConnection } from "../config/db.js";

export class DBService {
  client;
  constructor() {
    console.log("DBService registered")
    this.client = new DbConnection().getDbConnection();
  }
  async getUserCode(user_code_id: string) {
    try {
      const res = await this.client.query(
        "SELECT id, code, language, problem_id FROM submit_code_usercode WHERE id = $1",
        [user_code_id]
      );
      if (res.rows.length > 0) {
        const { id, code, language, problem_id } = res.rows[0];
        return { id, code, language, problem_id };
      } else {
        throw new Error("User code not found");
      }
    } catch (err) {
      console.error("Error fetching user code:", err);
      throw err;
    }
  }

  async updateUserCode(
    user_code_id: number,
    result: string,
    correct_cases: number,
    incorrect_cases: number,
    error_message: string
  ) {
    try {
      const res = await this.client.query(
        `UPDATE submit_code_usercode 
                       SET status = 'completed', result = $1, correct_cases = $2, incorrect_cases = $3, error_message = $4 
                       WHERE id = $5`,
        [result, correct_cases, incorrect_cases, error_message, user_code_id]
      );
      console.log("User code updated");
      return res;
    } catch (err) {
      console.error("Error updating user code:", err);
      throw err;
    }
  }
}
