import sys

def main():

    with open('./code.py','r') as f:
        user_code = f.read()

    with open('./test_cases.txt','r') as f:
        test_cases  = f.read()

    exec(user_code)

    outputs = []
  
    for output in outputs:
        print(output)
