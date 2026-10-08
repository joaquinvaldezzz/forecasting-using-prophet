# Plan 003: Resilient Server-Side Fetching and API Environment Configuration

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5dcf0c9..HEAD -- src/app/dashboard/page.tsx src/app/forecasting-tools/page.tsx next.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-build-and-eslint.md
- **Category**: bug
- **Planned at**: commit `5dcf0c9`, 2026-10-08

## Why this matters

In `src/app/dashboard/page.tsx` and `src/app/forecasting-tools/page.tsx`, Next.js Server Components make direct `fetch()` calls to `http://127.0.0.1:5000/api/...` without try/catch handling, timeout safeguards, or fallback UI states. If the Python backend is offline or slow during development or production rendering, Next.js throws an unhandled server rejection and crashes the entire page (HTTP 500). Furthermore, the backend URL is hardcoded into page files instead of using configurable environment variables (`API_BASE_URL` / `NEXT_PUBLIC_API_URL`).

## Current state

- `src/app/dashboard/page.tsx:34-40`:
  ```tsx
  export default async function Page() {
    const insights = await fetch("http://127.0.0.1:5000/api/insights").then(
      async (res) => (await res.json()) as InsightsData[],
    );
    const data = await fetch("http://127.0.0.1:5000/api/price-trends/2023").then(
      async (res) => (await res.json()) as PriceTrendsData[],
    );
  ```
- `src/app/forecasting-tools/page.tsx:44-46`:
  ```tsx
  export default async function Page() {
    const data = await fetch("http://127.0.0.1:5000/api/forecast").then(
      async (res) => (await res.json()) as ForecastData,
    );
  ```
- `next.config.ts:14-21`:
  Rewrites `/api/:path*` to `http://127.0.0.1:5000/api/:path*`.

## Commands you will need

| Purpose   | Command                    | Expected on success |
| --------- | -------------------------- | ------------------- |
| Typecheck | `pnpm exec tsc --noEmit`   | exit 0, no errors   |
| Build     | `pnpm build`               | exit 0, compile ok  |
| Lint      | `pnpm exec eslint src/app` | exit 0              |

## Scope

**In scope**:

- `src/app/dashboard/page.tsx`
- `src/app/forecasting-tools/page.tsx`
- `src/lib/api-client.ts` (create)
- `.env.example` (create)

**Out of scope**:

- Backend Python files
- Modifying UI design tokens

## Git workflow

- Branch: `advisor/003-resilient-server-fetching-and-config`
- Commits: Conventional commit (e.g. `feat: add resilient API client with fallbacks and env configuration`)

## Steps

### Step 1: Create centralized API client with fallback data and environment support

Create `src/lib/api-client.ts` with helper methods that safely fetch data, respect `process.env.API_BASE_URL || "http://127.0.0.1:5000"`, and provide safe fallback empty/initial states when the backend is unreachable:

```ts
const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:5000";

export async function fetchWithFallback<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.warn(`API error from ${endpoint}: ${res.status} ${res.statusText}`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.warn(`Failed to connect to ${endpoint}:`, error);
    return fallback;
  }
}
```

### Step 2: Update Server Component pages to use safe fetch client and handle empty states

1. In `src/app/dashboard/page.tsx`, replace raw `fetch` calls with `fetchWithFallback`:
   - Fallback for `insights`: empty array `[]` or default commodity records.
   - Fallback for `data`: empty array `[]`.
2. In `src/app/forecasting-tools/page.tsx`, replace raw `fetch` calls with `fetchWithFallback` with default empty commodity maps.
3. Ensure components render a friendly empty / offline banner or graceful skeleton if data is empty.

### Step 3: Add `.env.example`

Create `.env.example` in repo root:

```env
# URL for the Python Flask backend
API_BASE_URL=http://127.0.0.1:5000
```

**Verify**: Run `pnpm build` with the backend server stopped. The build must succeed without throwing uncaught fetch errors.

## Done criteria

- [ ] `pnpm build` succeeds even when the Python backend is offline.
- [ ] No hardcoded `http://127.0.0.1:5000` strings remain in `src/app/dashboard/page.tsx` or `src/app/forecasting-tools/page.tsx`.
- [ ] `.env.example` is committed in the repository.
- [ ] `plans/README.md` status row updated to DONE.

## STOP conditions

- If `fetchWithFallback` breaks type inference in Server Component props, STOP and check the generic type parameter.
- If Next.js App Router streaming or Suspense boundaries conflict with static generation, check `revalidate` configuration.

## Maintenance notes

- When deploying to production (e.g. Vercel + AWS/Fly.io backend), set `API_BASE_URL` in the environment settings.
