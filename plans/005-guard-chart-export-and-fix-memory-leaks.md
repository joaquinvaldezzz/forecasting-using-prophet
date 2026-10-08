# Plan 005: Guard Chart Export and Fix Object URL Memory Leaks

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5dcf0c9..HEAD -- src/lib/chart-export.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-build-and-eslint.md
- **Category**: bug
- **Planned at**: commit `5dcf0c9`, 2026-10-08

## Why this matters

In `src/lib/chart-export.ts`, `exportChartToCSV()` executes `const headers = Object.keys(data[0])` without checking if `data` contains any elements. If a user clicks the export button while data is loading or empty, this throws an uncaught runtime `TypeError`. Furthermore, created object URLs (`URL.createObjectURL`) are never released via `URL.revokeObjectURL`, leading to browser memory leaks. Fixing typing and adding input guards makes client-side export reliable.

## Current state

- `src/lib/chart-export.ts:4-18`:

  ```ts
  export const exportChartToCSV = (data: any[], filename: string = "chart-data.csv") => {
    // Convert data to CSV format
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  ```

## Commands you will need

| Purpose   | Command                                    | Expected on success |
| --------- | ------------------------------------------ | ------------------- |
| Typecheck | `pnpm exec tsc --noEmit`                   | exit 0, no errors   |
| Lint      | `pnpm exec eslint src/lib/chart-export.ts` | exit 0              |

## Scope

**In scope**:

- `src/lib/chart-export.ts`

**Out of scope**:

- Other files in `src/lib/`

## Git workflow

- Branch: `advisor/005-guard-chart-export-and-fix-memory-leaks`
- Commits: Conventional commit (e.g. `fix: guard CSV export against empty data and revoke object URLs`)

## Steps

### Step 1: Add empty check, proper typing, value escaping, and URL revocation to `exportChartToCSV`

Update `src/lib/chart-export.ts` to:

1. Accept generic record type `Record<string, unknown>[]` instead of `any[]`.
2. Guard against empty arrays `if (!data || data.length === 0) return;`.
3. Escape CSV string values that contain commas or double quotes.
4. Clean up the object URL after triggering the download using `setTimeout(() => URL.revokeObjectURL(url), 1000)`.

```ts
/**
 * Safely exports an array of objects to a downloadable CSV file.
 *
 * @param data Array of records to export.
 * @param filename Target filename.
 */
export const exportChartToCSV = (
  data: Array<Record<string, unknown>>,
  filename = "chart-data.csv",
): void => {
  if (data == null || data.length === 0 || data[0] == null) {
    console.warn("No data available to export to CSV.");
    return;
  }

  const headers = Object.keys(data[0]);
  const formatCell = (val: unknown): string => {
    if (val == null) return '""';
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(formatCell).join(","),
    ...data.map((row) => headers.map((header) => formatCell(row[header])).join(",")),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};
```

**Verify**: `pnpm exec tsc --noEmit` exits 0.

## Done criteria

- [ ] `exportChartToCSV([])` handles empty arrays safely without throwing errors.
- [ ] No `any` types remain in `src/lib/chart-export.ts`.
- [ ] Created object URLs are revoked after download.
- [ ] `pnpm exec tsc --noEmit` exits 0.
- [ ] `plans/README.md` status row updated to DONE.

## STOP conditions

- If `jsPDF` or `html2canvas` typing issues occur, verify versions in `package.json`.

## Maintenance notes

- If server-side CSV export is needed later, this client-side utility can remain as a lightweight fallback.
