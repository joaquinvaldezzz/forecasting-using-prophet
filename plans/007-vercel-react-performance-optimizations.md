# Plan 007: Vercel React & Next.js Performance Optimizations

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6e6c375..HEAD -- src/app/dashboard/page.tsx src/lib/chart-export.ts src/lib/utils.ts src/components/chart-area-interactive.tsx src/components/charts/chart-area-interactive.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-build-and-eslint.md, plans/005-guard-chart-export-and-fix-memory-leaks.md
- **Category**: perf
- **Planned at**: commit `6e6c375`, 2026-10-08

## Why this matters

Applying Vercel Engineering's React and Next.js performance best practices eliminates critical performance bottlenecks in this codebase:

1. **Eliminate Server Fetch Waterfall (`async-parallel`)**: In `src/app/dashboard/page.tsx`, `fetch()` calls to `/api/insights` and `/api/price-trends/2023` run sequentially, doubling the server response latency and time-to-first-byte (TTFB). Parallelizing them with `Promise.all` cuts server wait time in half.
2. **Optimize Client Bundle Size (`bundle-dynamic-imports`)**: `html2canvas` (~200KB) and `jspdf` (~350KB) are statically imported at the module top-level in `src/lib/chart-export.ts`. Dynamically importing them only when the user triggers an export reduces initial page payload by >550KB.
3. **Prevent Memory & GC Churn (`js-cache-function-results`)**: `Intl.NumberFormat` is instantiated on every single call in `formatAsCurrency()` in `src/lib/utils.ts`, causing GC thrashing across table and chart renders. Hoisting the formatter instance to module scope optimizes formatting to O(1).
4. **Eliminate Redundant Re-renders (`rerender-derived-state-no-effect`)**: In `src/components/chart-area-interactive.tsx`, synchronizing mobile time ranges via `useEffect` causes a second render frame and visual layout shift. Deriving state or initializing properly eliminates the extra render cycle.
5. **Clean Conditional Rendering (`rendering-conditional-render`)**: Replacing `&&` with explicit ternary operators (`? : null`) ensures clean VNode rendering and guards against inadvertent `0` or `NaN` outputs.

## Current state

- **Waterfall in Server Component** (`src/app/dashboard/page.tsx:34-40`):
  ```tsx
  export default async function Page() {
    const insights = await fetch("http://127.0.0.1:5000/api/insights").then(
      async (res) => (await res.json()) as InsightsData[],
    );
    const data = await fetch("http://127.0.0.1:5000/api/price-trends/2023").then(
      async (res) => (await res.json()) as PriceTrendsData[],
    );
  ```
- **Static Heavy Bundle Imports** (`src/lib/chart-export.ts:1-2`):
  ```ts
  import html2canvas from "html2canvas";
  import { jsPDF } from "jspdf";
  ```
- **Uncached Formatter Creation** (`src/lib/utils.ts:23-30`):
  ```ts
  export function formatAsCurrency(int: number): string {
    const PHP = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    });

    return PHP.format(int);
  }
  ```
- **Effect-Driven State Synchronization** (`src/components/chart-area-interactive.tsx:59-66`):
  ```tsx
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90d");

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);
  ```

## Commands you will need

| Purpose   | Command                  | Expected on success |
| --------- | ------------------------ | ------------------- |
| Typecheck | `pnpm exec tsc --noEmit` | exit 0, no errors   |
| Lint      | `pnpm exec eslint src/`  | exit 0, no errors   |
| Build     | `pnpm build`             | exit 0, compile ok  |

## Suggested executor toolkit

- Refer to the rules in `.agents/skills/vercel-react-best-practices/rules/`:
  - `async-parallel.md`
  - `bundle-dynamic-imports.md`
  - `js-cache-function-results.md`
  - `rerender-derived-state-no-effect.md`
  - `rendering-conditional-render.md`

## Scope

**In scope**:

- `src/app/dashboard/page.tsx`
- `src/lib/chart-export.ts`
- `src/lib/utils.ts`
- `src/components/chart-area-interactive.tsx`
- `src/components/charts/chart-area-interactive.tsx`

**Out of scope**:

- Backend Flask files in `back-end/`
- Component library primitives in `src/components/ui/`

## Git workflow

- Branch: `advisor/007-vercel-react-performance-optimizations`
- Commits: `perf(react): apply vercel performance best practices for waterfalls, bundles, and renders`

## Steps

### Step 1: Parallelize Server Component data fetching in `src/app/dashboard/page.tsx`

Use `Promise.all()` to eliminate the sequential fetch waterfall:

```tsx
export default async function Page() {
  const [insights, data] = await Promise.all([
    fetch("http://127.0.0.1:5000/api/insights").then(
      async (res) => (await res.json()) as InsightsData[],
    ),
    fetch("http://127.0.0.1:5000/api/price-trends/2023").then(
      async (res) => (await res.json()) as PriceTrendsData[],
    ),
  ]);
  // ...
```

_(Note: If Plan 003's `fetchWithFallback` is active, apply `Promise.all([fetchWithFallback(...), fetchWithFallback(...)])`)_

**Verify**: `pnpm exec tsc --noEmit` exits 0.

### Step 2: Dynamic import for heavy export libraries in `src/lib/chart-export.ts`

Remove top-level static imports of `html2canvas` and `jspdf`. Dynamically import them inside `exportChartToPNG` and `exportChartToPDF`:

```ts
export const exportChartToPNG = async (
  chartElement: HTMLElement,
  filename: string = "chart.png",
) => {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting chart to PNG:", error);
  }
};

export const exportChartToPDF = async (
  chartElement: HTMLElement,
  filename: string = "chart.pdf",
) => {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting chart to PDF:", error);
  }
};
```

**Verify**: `pnpm build` passes and bundle analysis confirms `jspdf`/`html2canvas` are split into async chunks.

### Step 3: Hoist `Intl.NumberFormat` instance in `src/lib/utils.ts`

Create the formatter once at module scope:

```ts
const phpCurrencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

/**
 * Formats a given number as a currency string in Philippine Peso (PHP).
 *
 * @param amount The number to format as currency.
 * @returns A string representing the formatted currency.
 */
export function formatAsCurrency(amount: number): string {
  return phpCurrencyFormatter.format(amount);
}
```

**Verify**: `pnpm exec tsc --noEmit` exits 0.

### Step 4: Optimize re-renders and date computations in chart components

1. In `src/components/chart-area-interactive.tsx`:
   - Replace the `useEffect` timeRange sync with initial state or derived time range calculation to avoid an extra post-mount render.
   - Wrap `filteredData` date calculation with `useMemo` so that date parsing is not re-executed on unrelated re-renders.
2. In `src/components/charts/chart-area-interactive.tsx`:
   - Replace inline `!isLoading && chartData != null && (...)` with ternary `(!isLoading && chartData != null) ? (...) : null` (`rendering-conditional-render`).
   - Memoize computed values for `config` label and color mappings to avoid object allocation in JSX props on every frame.

**Verify**: `pnpm exec eslint src/components/` exits 0 with no lint errors.

## Test plan

- Verify typecheck: `pnpm exec tsc --noEmit`
- Verify linting: `pnpm exec eslint src/`
- Verify production build: `pnpm build`
- Manual check: Open dashboard page and test CSV, PNG, and PDF export buttons to ensure dynamic imports resolve smoothly in the browser.

## Done criteria

- [ ] `src/app/dashboard/page.tsx` fetches server data concurrently with `Promise.all`.
- [ ] `html2canvas` and `jspdf` are dynamically imported in `src/lib/chart-export.ts`.
- [ ] `formatAsCurrency` reuses a hoisted `Intl.NumberFormat` instance.
- [ ] No `useEffect` state syncing in `src/components/chart-area-interactive.tsx`.
- [ ] `pnpm exec tsc --noEmit` and `pnpm build` pass with exit code 0.
- [ ] `plans/README.md` status row updated.

## STOP conditions

- If dynamic `import("html2canvas")` has default export type mismatches with ESM/CJS interop, check `next.config.ts` or use `(await import("html2canvas")).default ?? (await import("html2canvas"))`.
- If Next.js Server Actions or RSC serialization limits dynamic imports in client components, ensure `"use client"` is maintained on export modules.

## Maintenance notes

- Any newly introduced client export utilities or formatting helpers should follow the hoisted instance and dynamic chunking patterns established here.
