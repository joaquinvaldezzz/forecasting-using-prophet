# Plan 001: Fix Typecheck, Build, and ESLint Configuration

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 5dcf0c9..HEAD -- package.json commitlint.config.ts eslint.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `5dcf0c9`, 2026-10-08

## Why this matters

Currently `pnpm build` and `pnpm exec tsc --noEmit` fail immediately on fresh checkout because `commitlint.config.ts` imports `@commitlint/types` which is not present in `package.json` devDependencies. Furthermore, `eslint.config.ts` applies strict stylistic rules (`eslint-config-love`, `perfectionist/sort-jsx-props`, and JSDoc requirements) against generated shadcn UI components in `src/components/ui/`, producing over 900 lint errors and rendering pre-commit hooks and CI useless. Fixing this restores a clean verification baseline for all subsequent work.

## Current state

- `commitlint.config.ts:1`:

  ```ts
  import type { UserConfig } from "@commitlint/types";

  const config: UserConfig = {
    extends: ["@commitlint/config-conventional"],
    rules: {
      "header-max-length": [2, "always", 49], // subject line must be < 50 chars
    },
  };

  export default config;
  ```

- `package.json:116-148`:
  `@commitlint/types` is missing from `devDependencies`.
- `eslint.config.ts:44-55`:
  The `src/**` configuration block lacks an exclusion for `src/components/ui/**`, causing vendor shadcn components to trigger hundreds of rule violations.

## Commands you will need

| Purpose   | Command                         | Expected on success |
| --------- | ------------------------------- | ------------------- |
| Install   | `pnpm add -D @commitlint/types` | exit 0              |
| Typecheck | `pnpm exec tsc --noEmit`        | exit 0, no errors   |
| Build     | `pnpm build`                    | exit 0, compile ok  |
| Lint      | `pnpm exec eslint .`            | exit 0, 0 errors    |

## Scope

**In scope**:

- `package.json`
- `pnpm-lock.yaml`
- `commitlint.config.ts`
- `eslint.config.ts`

**Out of scope**:

- Direct refactoring or rewriting of shadcn components in `src/components/ui/`
- Backend python files

## Git workflow

- Branch: `advisor/001-fix-typecheck-build-and-eslint`
- Commits: Conventional commits matching repo style (e.g. `fix: add @commitlint/types and configure eslint ignores for ui components`)

## Steps

### Step 1: Install `@commitlint/types` and add `typecheck` script to `package.json`

1. Run `pnpm add -D @commitlint/types` to add the missing type definitions for commitlint.
2. In `package.json`, add `"typecheck": "tsc --noEmit"` to the `"scripts"` block.

**Verify**: `pnpm exec tsc --noEmit` → exits with code 0.

### Step 2: Configure ESLint ignores for `src/components/ui`

1. In `eslint.config.ts`, update the ignore list in the global ignore block:
   ```ts
   {
     ignores: ["android/**", "ios/**", "**/vite-env.d.ts", "src/components/ui/**"];
   }
   ```
2. Also ensure `src/next.config.mjs` (if still present) is ignored or removed (covered in Plan 004).

**Verify**: `pnpm exec eslint src/app` → exits with 0 errors.

### Step 3: Verify Next.js production build

Run the Next.js production build command to ensure all TypeScript checks during build succeed.

**Verify**: `pnpm build` → exits with code 0.

## Done criteria

- [ ] `pnpm exec tsc --noEmit` exits 0 with no errors.
- [ ] `pnpm build` completes successfully.
- [ ] `pnpm run typecheck` is available in `package.json` and exits 0.
- [ ] No files outside the in-scope list are modified (`git status`).
- [ ] `plans/README.md` status row updated to DONE.

## STOP conditions

- If `pnpm add -D @commitlint/types` fails due to lockfile or network issues, STOP and report.
- If `pnpm build` fails on errors unrelated to `@commitlint/types`, STOP and inspect the error trace.

## Maintenance notes

- When updating or adding new shadcn components in `src/components/ui/`, keep them excluded from custom perfectionist/jsdoc lint rules to avoid maintaining unnecessary overrides.
