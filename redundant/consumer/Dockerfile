FROM python:3.9-slim

WORKDIR /app
COPY run..

RUN adduser --disabled-password sandboxuser
USER sandboxuser

CMD ['run.sh']