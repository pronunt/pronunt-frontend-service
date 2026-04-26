const DEFAULT_AUTH_SERVICE_URL = "http://pronunt-auth-service:8000";
const DEFAULT_INGESTION_SERVICE_URL = "http://pronunt-ingestion-service:8000";
const DEFAULT_AGGREGATOR_SERVICE_URL = "http://pronunt-aggregator-service:8000";

function normalizeOrigin(value: string | undefined, fallback: string) {
  return (value && value.trim()) || fallback;
}

export const serviceOrigins = {
  auth: normalizeOrigin(process.env.AUTH_SERVICE_URL, DEFAULT_AUTH_SERVICE_URL),
  ingestion: normalizeOrigin(
    process.env.INGESTION_SERVICE_URL,
    DEFAULT_INGESTION_SERVICE_URL
  ),
  aggregator: normalizeOrigin(
    process.env.AGGREGATOR_SERVICE_URL,
    DEFAULT_AGGREGATOR_SERVICE_URL
  )
};
