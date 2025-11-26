# BRIN Client Count Dashboard

A modern dashboard built with Next.js (App Router + TypeScript) for monitoring and visualizing client count data from the BRIN API. The application supports multiple locations and sessions (morning/afternoon) with real-time data visualization using interactive charts.

## Requirements

- **Node.js** 18 or higher
- **npm**, **pnpm**, **yarn**, or **bun** package manager

## Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
NEXT_PUBLIC_APP_NAME="Brin Client Count"
BASE_API_URL="127.0.0.1"
BASE_API_PORT="1234"
LOCATIONS=["gatsu", "thamrin", "ancol"]
```

### Variable Descriptions

- **`BASE_API_URL`** - The hostname of the BRIN API server (without protocol)
  - Example: `127.0.0.1` or `api.example.com`
  
- **`BASE_API_PORT`** - The port number for the API server
  - Example: `1234` or `8080`
  - Leave empty or omit if using default port (80)

- **`LOCATIONS`** - Comma-separated list of location identifiers
  - Supported formats:
    - Simple: `gatsu,thamrin,pejaten`
    - JSON array: `["gatsu","thamrin","pejaten"]`
    - Single quotes: `['gatsu','thamrin','pejaten']`

The application uses these variables to build API request URLs in the format:
```
http://{BASE_API_URL}:{BASE_API_PORT}/client-count/{location}/{session}
```

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env  # If you have an example file
   # Or create .env manually and add the variables above
   ```

4. **Configure environment variables:**
   Edit the `.env` file and set the values according to your BRIN API configuration.

## Running the Project

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Features

- 📊 **Interactive Charts** - Real-time visualization of client count data
- 🏢 **Multi-Location Support** - Monitor multiple locations from a single dashboard
- ⏰ **Session Management** - Switch between morning (pagi) and afternoon (siang) sessions
- 🔄 **Auto-refresh** - Manual refresh capability for up-to-date data
- 📈 **Data Trends** - View trends and statistics for each location
- 🎨 **Modern UI** - Clean and responsive interface built with Tailwind CSS

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (Chart, UI components)
- `src/lib/` - Utility functions and configuration
  - `config.ts` - Environment variable parsing and configuration
  - `api/client-count.ts` - API client for fetching client count data

## How It Works

1. **Server-Side Rendering (SSR)** - The main page (`src/app/page.tsx`) reads location configuration from server-side environment variables
2. **Data Fetching** - Client components fetch data through Next.js API routes
3. **Real-time Updates** - Users can manually refresh data or change location/session filters
4. **Error Handling** - Failed requests are displayed with clear error messages

## License

This project is private and proprietary.
