# run_code.py (inside the container)
import sys

def main():
    try:
        # Read user code
        code = sys.stdin.readline().strip()

        # Read number of test cases
        t = int(sys.stdin.readline().strip())
        
        # Read test cases
        test_cases = []
        for _ in range(t):
            test_input = sys.stdin.readline().strip()
            expected_output = sys.stdin.readline().strip()
            test_cases.append((test_input, expected_output))

        # Execute user code
        exec_env = {}
        exec(code, {}, exec_env)

        # Check outputs
        correct_cases = 0
        for test_input, expected_output in test_cases:
            try:
                result = str(exec_env["solution"](test_input))
                if result == expected_output:
                    correct_cases += 1
            except Exception as e:
                print(f"Runtime error: {e}")

        # Print result (stdout will be captured)
        print(f"{correct_cases}/{t} test cases passed")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
