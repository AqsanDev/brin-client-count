# BRIN Client Count Dashboard

A modern dashboard built with Next.js for monitoring and visualizing client count data from the BRIN API. Supports multiple locations and sessions with real-time data visualization.

## Features

- 📊 Interactive charts with real-time data visualization
- 🏢 Multi-location support
- ⏰ Session management (morning/afternoon)
- 🔄 Manual refresh capability
- 🎨 Modern, responsive UI
- 🐳 Docker support for easy deployment

## Prerequisites

- **Node.js** 18+ (for local development)
- **Docker** (for containerized deployment)

## Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_APP_NAME="Brin Client Count"
BASE_API_URL="127.0.0.1"
BASE_API_PORT="1234"
LOCATIONS=["gatsu", "thamrin", "ancol"]
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `BASE_API_URL` | API server hostname (without protocol) | `127.0.0.1` or `api.example.com` |
| `BASE_API_PORT` | API server port | `1234` or `8080` |
| `LOCATIONS` | JSON array of location identifiers | `["gatsu", "thamrin", "ancol"]` |

## Running Locally

### Development Mode

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Running with Docker

### 1. Build the Docker Image

```bash
docker build -t brin-client-count .
```

### 2. Run the Container

**Option A: Using CLI flags**
```bash
docker run -d \
  -p 3000:3000 \
  -e BASE_API_URL="127.0.0.1" \
  -e BASE_API_PORT="1234" \
  -e LOCATIONS='["gatsu","ancol","pejaten"]' \
  --name brin-client-count \
  brin-client-count
```

**Option B: Using .env file (Recommended)**
```bash
# Create .env.production file with your variables
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name brin-client-count \
  brin-client-count
```

### 3. View Logs

```bash
docker logs brin-client-count
```

### 4. Stop/Remove Container

```bash
docker stop brin-client-count
docker rm brin-client-count
```

## Docker Hub Deployment

### Push to Docker Hub

```bash
# 1. Login to Docker Hub
docker login

# 2. Tag your image (replace 'your-username' with your Docker Hub username)
docker tag brin-client-count your-username/brin-client-count:latest

# 3. Push to Docker Hub
docker push your-username/brin-client-count:latest
```

### Pull and Run on Server

On your AlmaLinux server (or any Linux server):

**Option A: Using .env file (Recommended)**

```bash
# 1. Login to Docker Hub (if image is private)
docker login

# 2. Pull the image
docker pull your-username/brin-client-count:latest

# 3. Create .env.production file
cat > .env.production << EOF
BASE_API_URL="127.0.0.1"
BASE_API_PORT="1234"
LOCATIONS=["gatsu", "ancol", "pejaten"]
EOF

# 4. Run the container
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  --name brin-client-count \
  your-username/brin-client-count:latest

# 5. Verify it's running
docker ps
docker logs brin-client-count
```

**Option B: Using CLI flags (No .env file)**

```bash
# 1. Login to Docker Hub (if image is private)
docker login

# 2. Pull the image
docker pull your-username/brin-client-count:latest

# 3. Run the container with explicit environment variables
docker run -d \
  -p 3000:3000 \
  -e BASE_API_URL="127.0.0.1" \
  -e BASE_API_PORT="1234" \
  -e LOCATIONS='["gatsu","ancol","pejaten"]' \
  --restart unless-stopped \
  --name brin-client-count \
  your-username/brin-client-count:latest

# 4. Verify it's running
docker ps
docker logs brin-client-count
```


Access the application at `http://your-server-ip:3000`

## Docker Flags Explained

| Flag | Description |
|------|-------------|
| `-d` | Run container in background (detached mode) |
| `-p 3000:3000` | Map port 3000 on host to port 3000 in container |
| `-e VAR="value"` | Set environment variable |
| `--env-file` | Load environment variables from file |
| `--name` | Assign a name to the container |
| `--restart unless-stopped` | Auto-restart container unless manually stopped |

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # React components
│   └── lib/              # Utilities and configuration
├── public/               # Static assets
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore file
└── .env.example          # Environment variables template
```

## API Endpoint Format

The application constructs API URLs in the following format:

```
http://{BASE_API_URL}:{BASE_API_PORT}/client-count/{location}/{session}
```

Example: `http://127.0.0.1:1234/client-count/gatsu/pagi`

## Troubleshooting

### Locations not showing up in Docker

Make sure you've added `export const dynamic = "force-dynamic"` in `src/app/page.tsx` to ensure environment variables are read at runtime.

### Port already in use

Change the host port mapping:
```bash
docker run -p 8080:3000 ...  # Access via localhost:8080
```

### Container won't start

Check logs:
```bash
docker logs brin-client-count
```

## License

This project is private and proprietary.
