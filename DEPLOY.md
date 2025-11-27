# Deployment Guide

This guide explains how to build, push, and deploy the **Brin Client Count** application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/) installed on your machine and the server.
- A [Docker Hub](https://hub.docker.com/) account.

## 1. Build the Docker Image

Run the following command in the root directory of the project:

```bash
# Replace 'your-username' with your Docker Hub username
docker build -t your-username/brin-client-count:latest .
```

## 2. Push to Docker Hub

Login to Docker Hub if you haven't already:

```bash
docker login
```

Push the image:

```bash
docker push your-username/brin-client-count:latest
```

## 3. Deploy on Server

On your server, you can run the application using `docker run`. You can inject environment variables dynamically using the `-e` flag or an `.env` file.

### Option A: Using Command Line Flags

```bash
docker run -d \
  -p 3000:3000 \
  -e BASE_API_URL="https://api.production.com" \
  -e BASE_API_PORT="8080" \
  --name brin-client-count \
  your-username/brin-client-count:latest
```

### Option B: Using an .env File (Recommended)

1.  Create a `.env.production` file on your server:

    ```env
    BASE_API_URL="https://api.production.com"
    BASE_API_PORT="8080"
    ```

2.  Run the container with `--env-file`:

    ```bash
    docker run -d \
      -p 3000:3000 \
      --env-file .env.production \
      --name brin-client-count \
      your-username/brin-client-count:latest
    ```

> [!NOTE]
> `NEXT_PUBLIC_` variables are baked into the image at build time. If you need to change them, you must rebuild the image.
> However, server-side variables like `BASE_API_URL` (as configured in this project) can be injected at runtime as shown above.

### Handling JSON Arrays (e.g., LOCATIONS)

When passing JSON arrays like `LOCATIONS=["gatsu", "ancol"]` via the command line, you must be careful with quoting to avoid shell parsing errors.

**Option A: Using CLI (PowerShell/Bash)**
Wrap the entire value in single quotes `'` and escape the double quotes `\"` inside if necessary, or simply remove spaces if your app allows it.

```bash
# PowerShell / Bash
docker run -d \
  -p 3000:3000 \
  -e BASE_API_URL="10.13.222.10" \
  -e BASE_API_PORT="5010" \
  -e LOCATIONS='["gatsu","ancol","pejaten"]' \
  --name brin-client-count \
  your-username/brin-client-count:latest
```

**Option B: Using .env File (Easiest)**
This is the recommended way as it avoids quoting issues.

In your `.env.production` file:
```env
BASE_API_URL="10.13.222.10"
BASE_API_PORT="5010"
LOCATIONS=["gatsu", "ancol", "pejaten"]
```

