const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 🔁 Retry fetch (important for weak signal)
export default async function fetchWithRetry(url: string, options: any, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const text = await res.text();
        if (res.status >= 400 && res.status < 500) {
          throw new Error(text || "Client error");
        }
        throw new Error(text || "Request failed");
      }

      return res;
    } catch (err) {
      if (i === retries) throw err;
      await sleep(1000);
    }
  }
  throw new Error("Retry failed");
}
