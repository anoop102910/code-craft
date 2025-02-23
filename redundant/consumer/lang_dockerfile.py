def get_dockerfile(language, user_code_id):
    if language == "python":
        return f"""
        FROM python:3.9-slim
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.py .
        RUN adduser --disabled-password sandboxuser
        USER sandboxuser
        CMD ["python3", "{user_code_id}.py"]
        """
    
    elif language == "cpp":
        return f"""
        FROM gcc:latest
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.cpp .
        RUN g++ {user_code_id}.cpp -o {user_code_id} -std=c++11
        RUN useradd -m sandboxuser
        USER sandboxuser
        CMD ["./{user_code_id}"]
        """

    elif language == "c":
        return f"""
        FROM alpine:latest
        RUN apk add --no-cache gcc musl-dev
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.c .
        RUN gcc {user_code_id}.c -o {user_code_id} -std=c11
        RUN adduser -D sandboxuser
        USER sandboxuser
        CMD ["./{user_code_id}"]
        """

    elif language == "javascript":
        return f"""
        FROM node:alpine
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.js .
        RUN adduser -D sandboxuser
        USER sandboxuser
        CMD ["node", "{user_code_id}.js"]
        """

    elif language == "java":
        return f"""
        FROM eclipse-temurin:17-jdk-alpine
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.java .
        RUN javac {user_code_id}.java
        RUN adduser -D sandboxuser
        USER sandboxuser
        CMD ["java", "{user_code_id}"]
        """

    elif language == "go":
        return f"""
        FROM golang:alpine
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.go .
        RUN go build -o {user_code_id} {user_code_id}.go
        RUN adduser -D sandboxuser
        USER sandboxuser
        CMD ["./{user_code_id}"]
        """

    elif language == "rust":
        return f"""
        FROM rust:alpine
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.rs .
        RUN rustc {user_code_id}.rs -o {user_code_id}
        RUN adduser -D sandboxuser
        USER sandboxuser
        CMD ["./{user_code_id}"]
        """

    elif language == "ruby":
        return f"""
        FROM ruby:alpine
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.rb .
        RUN adduser -D sandboxuser
        USER sandboxuser
        CMD ["ruby", "{user_code_id}.rb"]
        """

    elif language == "php":
        return f"""
        FROM php:alpine
        WORKDIR /app-{user_code_id}
        COPY {user_code_id}.php .
        RUN adduser -D sandboxuser
        USER sandboxuser
        CMD ["php", "{user_code_id}.php"]
        """

    else:
        raise ValueError(f"Language {language} not supported")
