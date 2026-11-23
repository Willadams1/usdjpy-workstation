// Backend health check against the existing M0 endpoint. Takes fetch as a parameter so it can be tested.
export async function checkHealth({ timeoutMs = 5000, fetchImpl = globalThis.fetch } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl("/api/health", { signal: controller.signal, headers: { accept: "application/json" } });
    if (!res.ok) return { status: "error", error: `HTTP ${res.status}` };
    const data = await res.json();
    if (data?.status !== "ok") return { status: "error", error: "Unexpected response" };
    return { status: "ok", data };
  } catch (err) {
    return { status: "error", error: err?.name === "AbortError" ? "Timed out" : "Network error" };
  } finally {
    clearTimeout(timer);
  }
}
