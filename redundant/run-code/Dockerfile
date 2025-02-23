FROM python:3.9-slim

WORKDIR /app

RUN pip install requests

COPY . .

RUN adduser --disabled-password sandboxuser
USER sandboxuser

CMD ["python3", "main.py"]
