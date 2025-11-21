This repository hosts the BRIN Client Count dashboard built on Next.js (App Router + TypeScript). The app fetches client-count data from the BRIN API per location and session (pagi/siang) using runtime environment variables so it can target any backend environment.

## Requirements

- Node.js 18+
- npm (or pnpm / yarn / bun)

## Environment variables

Create a `.env` file in the project root and provide the following variables:

```
NEXT_PUBLIC_BASE_API_URL=127.0.0.1
NEXT_PUBLIC_BASE_API_PORT=1234
NEXT_PUBLIC_LOCATIONS=gatsu,thamrin,pejaten
```

- `NEXT_PUBLIC_BASE_API_URL` – hostname of the BRIN API (without protocol).
- `NEXT_PUBLIC_BASE_API_PORT` – API port (omit or leave empty if using the default port for the protocol).
- `NEXT_PUBLIC_LOCATIONS` – comma-separated list of location identifiers (e.g. `["gatsu","thamrin","pejaten"]`).

These variables are read inside `src/lib/config.ts` and used to build the request URL `http://{URL}:{PORT}/client-count/{location}/{session}`.

## Running locally

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the dashboard. The home page (`src/app/page.tsx`) fetches the API on the server, displays one card per location, and streams the raw payload for easy debugging. Failed requests are surfaced with an inline error banner so issues are visible immediately during development.

## Fetching logic overview

- `src/lib/config.ts` normalizes and validates the environment variables.
- `src/lib/api/client-count.ts` exposes `fetchClientCounts`, handling timeouts, caching, and parallel requests for all configured locations.
- Server components (e.g. `src/app/page.tsx`) call `fetchClientCounts` to render data at request time. To change the session, pass `{ session: "siang" }` to `fetchClientCounts`.

This structure keeps credentials/configuration in `.env`, makes the fetch reusable across routes/components, and stays aligned with Next.js best practices (server-side data fetching + `NEXT_PUBLIC_*` runtime configuration).
