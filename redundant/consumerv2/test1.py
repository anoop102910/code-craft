import subprocess
import os
import threading
import queue

test_cases = [
    {"input": "1 2", "output": "3"},
    {"input": "3 4", "output": "7"},
    {"input": "0 0", "output": "0"}
]

def main():
    current_directory = os.getcwd()
    volume_mount_path = f"{current_directory}/user_code.py:/app/user_code.py"

    print(f"Volume mount path: {volume_mount_path}")

    print('Running subprocess...')
    process = subprocess.Popen(
        [
            'docker', 'run',
            '--rm',
            '-i',
            '-v', volume_mount_path,
            'python_runner'
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )

    try:
        process.stdin.write(f"{len(test_cases)}\n")
        process.stdin.flush()

        for test_case in test_cases:
            output = run_test_case(process, test_case['input'])
            print(f"Expected: {test_case['output']}, Got: {output}")

    except Exception as e:
        print(f"Error occurred: {e}")

    finally:
        process.stdin.close()
        try:
            stdout_data, stderr_data = process.communicate(timeout=5)
            if stdout_data:
                print("Output:\n", stdout_data.strip())
            if stderr_data:
                print("Error:\n", stderr_data.strip())
        except subprocess.TimeoutExpired:
            print("Process timed out.")
            process.kill()

def run_test_case(process, test_input):
    """ Sends input and retrieves output using a separate thread with timeout """
    for value in test_input.split():
        process.stdin.write(f"{value}\n")
    process.stdin.flush()

    output_queue = queue.Queue()

    def read_output():
        try:
            line = process.stdout.readline().strip()
            output_queue.put(line)
        except Exception as e:
            output_queue.put("Error reading output")

    thread = threading.Thread(target=read_output)
    thread.start()
    thread.join(timeout=3)  # Wait max 3 sec for response

    if thread.is_alive():
        print("Test case timed out! No response.")
        return "No response"
    
    return output_queue.get() if not output_queue.empty() else "No response"

def is_correct(output, exp_output):
    return output == exp_output

main()
