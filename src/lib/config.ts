export type Session = "pagi" | "siang";

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  // Jangan crash saat runtime kalau env belum di-set.
  // Biarkan consumer yang melakukan handling error sendiri.
  return value ?? "";
};

// Mendukung beberapa format untuk NEXT_PUBLIC_LOCATIONS:
// - gatsu,thamrin,pejaten
// - ["gatsu","thamrin","pejaten"]
// - ['gatsu','thamrin','pejaten']
const parseLocations = (value: string) => {
  if (!value) return [];

  const trimmed = value.trim();

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, `"`));
      if (Array.isArray(parsed)) {
        return parsed.map((loc) => String(loc).trim()).filter(Boolean);
      }
    } catch {
      // fallback below
    }
  }

  return value
    .replace(/[\[\]"']/g, "")
    .split(",")
    .map((location) => location.trim())
    .filter(Boolean);
};

const resolveBaseApiUrl = () => {
  const envValue = getRequiredEnv("NEXT_PUBLIC_BASE_API_URL").trim();
  if (envValue) return envValue;

  if (typeof window !== "undefined" && window.location.hostname) {
    console.warn(
      "[config] NEXT_PUBLIC_BASE_API_URL tidak ditemukan. Menggunakan window.location.hostname sebagai fallback."
    );
    return window.location.hostname;
  }

  return "127.0.0.1";
};

const resolveBaseApiPort = () => {
  const envValue = process.env.NEXT_PUBLIC_BASE_API_PORT?.trim();
  if (envValue) return envValue;

  if (typeof window !== "undefined" && window.location.port) {
    return window.location.port;
  }

  return "80";
};

const baseApiUrl = resolveBaseApiUrl();
const baseApiPort = resolveBaseApiPort();
const locationsValue = process.env.NEXT_PUBLIC_LOCATIONS ?? "";

export const appConfig = {
  baseApiUrl,
  baseApiPort,
  locations: parseLocations(locationsValue),
};

export const DEFAULT_SESSION: Session = "pagi";

export const buildClientCountUrl = (location: string, session: Session) => {
  const portSegment = baseApiPort ? `:${baseApiPort}` : "";
  const safeLocation = encodeURIComponent(location.trim());
  return `http://${baseApiUrl}${portSegment}/client-count/${safeLocation}/${session}`;
};

