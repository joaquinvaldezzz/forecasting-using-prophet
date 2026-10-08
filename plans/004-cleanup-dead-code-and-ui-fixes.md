# Plan 004: Clean Up Dead Code, Consolidate Chart Components, and Fix UI Trend Icon

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6e6c375..HEAD -- src/components/ src/app/ src/next.config.mjs`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-build-and-eslint.md
- **Category**: tech-debt
- **Planned at**: commit `6e6c375`, 2026-10-08

## Why this matters

The codebase currently contains more than 12 unreferenced/abandoned components left over from template boilerplate (e.g. `chart-01.tsx` through `chart-06.tsx`, `model-training.tsx` with fake SaaS subscriber numbers, `nav-user.tsx`, `action-buttons.tsx`). Additionally, `ChartAreaInteractive` is duplicated across three different files (`src/components/chart-area-interactive.tsx`, `src/components/charts/chart-area-interactive.tsx`, `src/app/dashboard/chart-area-interactive.tsx`), and a stray `src/next.config.mjs` resides inside `src/`. Removing dead code simplifies the project architecture, speeds up build times, and eliminates false lint issues. Furthermore, `SectionCards` has a UI bug where downward trends render an upward arrow icon.

## Current state

- `src/components/section-cards.tsx:50-55`:
  ```tsx
  <CardFooter className="flex-col items-start gap-1.5 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">
      {insight.trend} <IconTrendingUp className="size-4" />
    </div>
    <div className="text-muted-foreground">
      {insight.price_change}% change in the last 12 months
    </div>
  </CardFooter>
  ```
  Line 52 unconditionally renders `IconTrendingUp`.
- Dead / unreferenced files:
  - `src/components/chart-01.tsx` through `src/components/chart-06.tsx`
  - `src/components/action-buttons.tsx`
  - `src/components/data-table.tsx`
  - `src/components/date-picker.tsx`
  - `src/components/nav-documents.tsx`
  - `src/components/nav-secondary.tsx`
  - `src/components/nav-user.tsx`
  - `src/components/forecast/forecast-assistant.tsx`
  - `src/components/dashboard/forecast-summary.tsx`
  - `src/components/dashboard/price-forecast-summary.tsx`
  - `src/components/dashboard/model-training.tsx`
  - `src/components/dashboard/key-insights.tsx`
  - `src/next.config.mjs`

## Commands you will need

| Purpose   | Command                  | Expected on success |
| --------- | ------------------------ | ------------------- |
| Typecheck | `pnpm exec tsc --noEmit` | exit 0, no errors   |
| Lint      | `pnpm exec eslint src/`  | exit 0, no errors   |
| Build     | `pnpm build`             | exit 0, compile ok  |

## Scope

**In scope**:

- Delete listed dead components in `src/components/` and `src/next.config.mjs`
- `src/components/section-cards.tsx`
- Consolidate chart components and update import references in `src/app/dashboard/page.tsx` and `src/app/forecasting-tools/page.tsx`

**Out of scope**:

- Modifying UI components under `src/components/ui/`

## Git workflow

- Branch: `advisor/004-cleanup-dead-code-and-ui-fixes`
- Commits: Conventional commits (e.g. `refactor: purge dead components and fix trend icon`)

## Steps

### Step 1: Remove unreferenced dead components and stray next config

Delete the following unused files:

- `src/components/chart-01.tsx`
- `src/components/chart-02.tsx`
- `src/components/chart-03.tsx`
- `src/components/chart-04.tsx`
- `src/components/chart-05.tsx`
- `src/components/chart-06.tsx`
- `src/components/action-buttons.tsx`
- `src/components/data-table.tsx`
- `src/components/date-picker.tsx`
- `src/components/nav-documents.tsx`
- `src/components/nav-secondary.tsx`
- `src/components/nav-user.tsx`
- `src/components/forecast/forecast-assistant.tsx`
- `src/components/dashboard/forecast-summary.tsx`
- `src/components/dashboard/price-forecast-summary.tsx`
- `src/components/dashboard/model-training.tsx`
- `src/components/dashboard/key-insights.tsx`
- `src/next.config.mjs`

**Verify**: `pnpm exec tsc --noEmit` to confirm no active imports were broken.

### Step 2: Fix trend icon in `src/components/section-cards.tsx`

Update line 50-55 of `src/components/section-cards.tsx` to conditionally render `IconTrendingUp` or `IconTrendingDown`:

```tsx
<CardFooter className="flex-col items-start gap-1.5 text-sm">
  <div className="line-clamp-1 flex items-center gap-2 font-medium capitalize">
    {insight.trend}{" "}
    {insight.trend === "up" ? (
      <IconTrendingUp className="size-4 text-red-500" />
    ) : (
      <IconTrendingDown className="size-4 text-emerald-500" />
    )}
  </div>
  <div className="text-muted-foreground">
    {Math.abs(insight.price_change)}% change in the last 12 months
  </div>
</CardFooter>
```

**Verify**: Check that when `insight.trend === "down"`, the downward icon and positive change format are rendered.

### Step 3: Verify build and typecheck

Run build to confirm the tree is clean.

**Verify**: `pnpm build` → exits 0.

## Done criteria

- [ ] All 17 dead files are removed from `src/`.
- [ ] `src/components/section-cards.tsx` correctly renders `IconTrendingDown` for downward trends.
- [ ] `pnpm exec tsc --noEmit` and `pnpm build` exit with code 0.
- [ ] `plans/README.md` status row updated to DONE.

## STOP conditions

- If deleting any component breaks an import in an active route, STOP and verify the import reference.

## Maintenance notes

- When creating new dashboard widgets, ensure they are actively wired into routes and avoid leaving scaffolded draft files in `src/components/`.
