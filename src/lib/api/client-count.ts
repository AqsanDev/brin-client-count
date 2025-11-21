import { appConfig, buildClientCountUrl, DEFAULT_SESSION, Session } from "@/lib/config";

type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

const REQUEST_TIMEOUT_MS = 8000;

const fetchWithTimeout = async (url: string, options?: NextFetchOptions, timeout = REQUEST_TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      cache: "no-store",
      ...options,
      signal: options?.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
};

export interface ClientCountResult<TPayload = unknown> {
  location: string;
  session: Session;
  payload: TPayload;
}

export interface FetchClientCountsOptions {
  session?: Session;
  locations?: string[];
  request?: NextFetchOptions;
  revalidateSeconds?: number;
}

export async function fetchClientCounts<TPayload = unknown>({
  session = DEFAULT_SESSION,
  locations = appConfig.locations,
  request,
  revalidateSeconds,
}: FetchClientCountsOptions = {}): Promise<ClientCountResult<TPayload>[]> {
  if (!locations.length) {
    throw new Error("No locations configured. Please set NEXT_PUBLIC_LOCATIONS in your environment variables.");
  }

  const fetchOptions: NextFetchOptions = {
    ...request,
    next: revalidateSeconds ? { revalidate: revalidateSeconds } : request?.next,
  };

  const results = await Promise.all(
    locations.map(async (location) => {
      const url = buildClientCountUrl(location, session);
      const response = await fetchWithTimeout(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch client count for ${location} (${response.status} ${response.statusText})`);
      }

      const payload = (await response.json()) as TPayload;

      return {
        location,
        session,
        payload,
      };
    })
  );

  return results;
}

