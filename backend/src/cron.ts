
const HEALTH_URL =
  process.env.HEALTH_URL ??
  "https://habheat-api.onrender.com/api/health";

const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const TIMEOUT_MS = 15_000; // 15 seconds

async function pingBackend(): Promise<void> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(HEALTH_URL, {
      method: "GET",
      signal: controller.signal,
    });

    if (response.ok) {
      console.log(
        `[${new Date().toISOString()}] HabHeat API is awake.`,
      );
    } else {
      console.error(
        `[${new Date().toISOString()}] Health check failed:`,
        response.status,
      );
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Could not reach HabHeat API:`,
      error instanceof Error ? error.message : error,
    );
  } finally {
    clearTimeout(timeout);
  }
}

console.log("HabHeat keep-alive monitor started.");
console.log(`Target: ${HEALTH_URL}`);
console.log("Ping interval: 10 minutes.");

// Check immediately, then every 10 minutes.
void pingBackend();
setInterval(() => {
  void pingBackend();
}, INTERVAL_MS);
