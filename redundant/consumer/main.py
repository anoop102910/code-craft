import json
from execute import execute_code
from db_config import get_cursor
import sys
from test_case import get_test_case
from sqs import get_messages, delete_message
import time

try:
    cursor = get_cursor()
except Exception as e:
    print("something went wrong",e)
    sys.exit(1)   

def get_user_code(user_code_id):
    print('fetching user code')
    cursor.execute("SELECT id, code, language, problem_id FROM submit_code_usercode WHERE id = %s", (user_code_id,))
    id, code, language, problem_id =  cursor.fetchone()
    print(id, code, language, problem_id)
    return id, code, language, problem_id

def update_user_code(user_code_id, result, correct_cases, incorrect_cases, error_message):
    print('updating user code')
    print(result, correct_cases, incorrect_cases, user_code_id)
    cursor.execute("UPDATE submit_code_usercode SET status = 'completed', result = %s, correct_cases = %s, incorrect_cases = %s, error_message = %s WHERE id = %s", (result, correct_cases, incorrect_cases,error_message, user_code_id))
    cursor.connection.commit()
    print('user code updated')

def update_user_code_error(user_code_id, error_message):
    print('updating user code error')
    cursor.execute("UPDATE submit_code_usercode SET status = 'completed', result = false, error_message = %s WHERE id = %s", (error_message, user_code_id))
    cursor.connection.commit()
    print('user code error updated')

def jsonify_test_code(test_cases_file):
    test_cases = []
    i = 0
    for line in test_cases_file.split("\n"):
        if line.strip():
            test_cases.append({"input": line.strip()} if i % 2 == 0 else {"output": line.strip()})
            i += 1
    return test_cases

def create_code_file(code, language, user_code_id):
    print('creating code file')
    with open(f"{user_code_id}.{language}", "w") as f:
        f.write(code)
    print('code file created')

def main():
    try:
        messages = get_messages()
        # print(messages)
        if messages:
            for msg in messages:
                user_code_id = json.loads(msg["Body"]).get("user_code_id")
                print("executing code for user_code_id", user_code_id)
                if not user_code_id:
                    print('no user code id found')
                    continue
                user_code_id, code, language, problem_id = get_user_code(user_code_id)
                test_cases_file = get_test_case(problem_id)
                test_cases = jsonify_test_code(test_cases_file)
                try:
                    create_code_file(code, language, user_code_id)
                    try:
                        ex_response = execute_code(user_code_id, language, test_cases)
                    except Exception as e:
                        print(e)
                        update_user_code_error(user_code_id, str(e))
                        delete_message(msg["ReceiptHandle"])
                        continue
                    print("ex_response", ex_response)
                    update_user_code(user_code_id, ex_response.get("result"),
                                    ex_response.get("correct_cases"), 
                                    ex_response.get("incorrect_cases"),
                                    ex_response.get('error_message'))
                    delete_message(msg["ReceiptHandle"])
                except Exception as e:
                    print(e)
                    continue
        else:
            # print("No messages in the queue")
            pass
    except Exception as e:
        print("something went wrong",e)
        raise e


if __name__ == "__main__":
    while True:
        main()  
        time.sleep(1)   