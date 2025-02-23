import sys

def main():

    with open('./code.py','r') as f:
        user_code = f.read()
    

    with open('./test_case.json','r') as f:
        test_cases  = f.read()

    exec(user_code)

    outputs = []
    for test_case in test_cases:
        sys.stdin.write(test_case.input)
        outputs.append(sys.stdout.read())

    for output in outputs:
        print(output)

main()