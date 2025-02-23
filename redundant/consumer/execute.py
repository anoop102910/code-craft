import subprocess
import os
import time
from lang_dockerfile import get_dockerfile

def execute_code(user_code_id, language, test_cases):
    print('executing code')
    dockerfile_name = f'Dockerfile.{user_code_id}'
    code_file_name = f'{user_code_id}.{language}'
    start_time = time.time()

    with open(dockerfile_name, 'w') as f:
        f.write(get_dockerfile(language, user_code_id))

    print('dockerfile written')
    try:
        result = subprocess.run(
            ["docker", "build", "-f", dockerfile_name, "-t", str(user_code_id), "."],
            check=False,
            stdout=subprocess.DEVNULL,
            stdin=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if result.returncode != 0:
            print(result.stderr)
            cleanup_resources(dockerfile_name, code_file_name)
            return {
                "correct_cases": 0,
                "incorrect_cases": 0,
                "result": "compilation_error",
                "error_message": result.stderr
            }
    except Exception as e:
        cleanup_resources(dockerfile_name, code_file_name)
        return {
            "correct_cases": 0,
            "incorrect_cases": 0,
            "result": "compilation_error",
            "error_message": str(e)
        }

    print('docker container built')
    try:
        correct_cases = 0
        incorrect_cases = 0
        process = subprocess.Popen(
            ["docker", "run", "--rm",
            "--network", "none",
            "-i", 
            "-m", "100m",
            "--cpus", "1.0",
            str(user_code_id)],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=0,
            universal_newlines=True
        )
        print('process created', flush=True)
        print('writing t', len(test_cases))
        process.stdin.write(f"{str(len(test_cases))}\n")
        print("entered t", flush=True)
        process.stdin.flush()
        print('flushed t', flush=True)

        for i, test_case in enumerate(test_cases, 1):
            print(f"checking for test case {i}", flush=True)
            process.stdin.write(f"{test_case.get('input')}\n")
            print(test_case.get('input'))
            print('entered input', flush=True)
            process.stdin.flush()
            print('flushed stdin', flush=True)
            
            try:
                print("reading output", flush=True)
                output = process.stdout.readline().strip()
                print("output: ", output)
                if output == test_case.get("output"):
                    print("pass")
                    correct_cases += 1
                else:
                    print("fail")
                    incorrect_cases += 1
            except Exception as e:
                print(f"Error reading output: {e}")
                process.kill()
                raise Exception(f"Error during test case {i}: {e}")
        
        print("all test cases checked")
        process.stdin.close()
        process.terminate()
        process.wait(timeout=5)
        print('code executed')
        return {"correct_cases": correct_cases, "incorrect_cases": incorrect_cases, "result": "accepted" if correct_cases == len(test_cases) else "wrong_answer"}
    except subprocess.CalledProcessError as e:
        print(e)
        raise Exception(e)
    except subprocess.TimeoutExpired as e:
        print(e)
        raise Exception("Time limit exceeded")
    except Exception as e:
        print(e)
        raise Exception(e)
    finally:
        end_time = time.time()
        print(f"Time taken: {end_time - start_time} seconds")
        cleanup_resources(dockerfile_name, code_file_name)

def cleanup_resources(dockerfile_name, code_file_name):
    try:
        os.remove(dockerfile_name)
        os.remove(code_file_name)
    except Exception as e:
        print(f"Cleanup failed: {e}")
