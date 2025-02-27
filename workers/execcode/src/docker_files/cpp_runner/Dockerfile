FROM gcc:latest
WORKDIR /app

RUN adduser --disabled-password sandboxuser
USER sandboxuser

ENTRYPOINT ["bash", "-c", "g++ user_code.cpp -o user_code -std=c++11 && ./user_code"]       
