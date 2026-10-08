/**
 * Safely fetches data from the API with fallback handling, timeout safeguards, and Next.js
 * revalidation cache settings.
 *
 * @param endpoint The API endpoint path (e.g. "/api/insights").
 * @param fallback The fallback value to return if the request fails or times out.
 * @returns The fetched data or fallback value.
 */
export async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const baseUrl = process.env.BACKEND_URL ?? process.env.API_BASE_URL ?? "http://127.0.0.1:5000";
    const relativePath = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    const baseWithTrailingSlash = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const targetUrl = new URL(relativePath, baseWithTrailingSlash);

    const res = await fetch(targetUrl, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`API error from ${endpoint}: ${res.status} ${res.statusText}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to connect to ${endpoint}:`, error);
    return fallback;
  }
}
