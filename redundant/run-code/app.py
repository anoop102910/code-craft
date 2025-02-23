import subprocess
import tempfile
import json
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

@app.get("/")
def index():
    return {"message": "Hello, World!"}

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

@app.post("/run-code")
async def run(request: Request):
    print("Running")
    data = await request.json()
    prob_response = requests.get(f'http://localhost:8000/api/problems/{data.get("slug")}')
    if prob_response.status_code != 200:
        return {"error": "Problem not found"}, 404
    
    problem_data = prob_response.json()
    problem = problem_data.get("data")
    test_cases = problem.get("all_test_cases")

    print(test_cases)
    
    code = data.get("code")
    language = data.get("language")

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

        return Response(content=json.dumps({"correct_cases": correct_cases, "incorrect_cases": incorrect_cases, "result":correct_cases==len(test_cases)}), media_type="application/json")
    
    except subprocess.TimeoutExpired as e:
        return Response(content=json.dumps({"error": "Timeout"}), media_type="application/json", status_code=408)

    except subprocess.CalledProcessError as e:
        content =  {
            "error": {
                "stderr": e.stderr or "Compilation/Execution error (stderr is empty)"
            }
        }
        return Response(content=json.dumps(content), media_type="application/json", status_code=404, headers={"X-Error": "Compilation/Execution error"})
