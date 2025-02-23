# python-runner Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN adduser --disabled-password sandboxuser
USER sandboxuser

ENTRYPOINT ["python3", "user_code.py"]
