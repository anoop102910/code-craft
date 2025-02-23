import subprocess
import tempfile
import json
import requests

Langconfig = {
    "python": {
        "compile": None,
        "run": ["python"]
    },
    "cpp": {
        "compile": ["g++", "-o", "a.out"],
        "run": ["./a.out"]
    },
    "java": {
        "compile": ["javac"],
        "run": ["java"]
    },
    "javascript": {
        "compile": None,
        "run": ["node"]
    },
    "c": {
        "compile": ["gcc", "-o", "a.out"],
        "run": ["./a.out"]
    },
}


def execute_code(code, language, test_cases):
    if language not in Langconfig:
        return {"error": "Invalid language"}, 400

    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=f".{language}") as temp_file:
        temp_file.write(code)
        temp_file_path = temp_file.name

    try:
        if Langconfig[language]["compile"]:
            compile_cmd = Langconfig[language]["compile"] + [temp_file_path]
            subprocess.run(compile_cmd, check=True, capture_output=True, text=True, timeout=10)

        run_cmd = Langconfig[language]["run"] + ([temp_file_path] if language is not "cpp" and language is not "c" else [])

        correct_cases = 0
        incorrect_cases = 0

        for test_case in test_cases:
            result = subprocess.run(run_cmd, input=test_case.get("input"), capture_output=True, text=True, check=True, timeout=10)
            print(f"Input: {test_case.get('input')} Output: {result.stdout.strip()} Expected: {test_case.get('output')} GOT: {result.stdout.strip()}")
            if result.stdout.strip()!=test_case.get("output"):
                incorrect_cases += 1
            else:
                correct_cases += 1

        return {"correct_cases": correct_cases, "incorrect_cases": incorrect_cases, "result":correct_cases==len(test_cases)}
    
    except subprocess.TimeoutExpired as e:
        raise Exception("Time limit exceeded")

    except subprocess.CalledProcessError as e:
        content =  {
            "error": {
                "stderr": e.stderr or "Compilation/Execution error (stderr is empty)"
            }
        }
        raise Exception(content)
