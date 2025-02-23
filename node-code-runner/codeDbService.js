import { getDbConnection } from "./src/config/db.js";

export const getUserCode = async (user_code_id) => {
    const client = await getDbConnection();
    try {
        const res = await client.query('SELECT id, code, language, problem_id FROM submit_code_usercode WHERE id = $1', [user_code_id]);
        if (res.rows.length > 0) {
            const { id, code, language, problem_id } = res.rows[0];
            return { id, code, language, problem_id };
        } else {
            throw new Error('User code not found');
        }
    } catch (err) {
        console.error('Error fetching user code:', err);
        throw err;
    }
}

export const updateUserCode = async (user_code_id, result, correct_cases, incorrect_cases, error_message) => {
    const client = await getDb();
    try {
        await client.query(
            `UPDATE submit_code_usercode 
             SET status = 'completed', result = $1, correct_cases = $2, incorrect_cases = $3, error_message = $4 
             WHERE id = $5`,
            [result, correct_cases, incorrect_cases, error_message, user_code_id]
        );
        console.log('User code updated');
    } catch (err) {
        console.error('Error updating user code:', err);
        throw err;
    }
}

