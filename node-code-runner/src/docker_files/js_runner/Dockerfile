# js-runner Dockerfile
FROM node:16-slim

WORKDIR /app

RUN adduser --disabled-password sandboxuser
USER sandboxuser

ENTRYPOINT ["node", "user_code.js"]
