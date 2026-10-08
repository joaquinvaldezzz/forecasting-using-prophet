# Plan 001: Fix Typecheck, Build, and ESLint Configuration

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 7bf4395..HEAD -- package.json commitlint.config.ts eslint.config.mjs eslint.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `7bf4395`, 2026-10-08

## Why this matters

`pnpm build` and `tsc --noEmit` fail on fresh checkout because `commitlint.config.ts` imports `@commitlint/types` which is missing from `package.json` devDependencies. Additionally, commit `79a6d63` added `eslint.config.mjs` (which takes precedence over the legacy `eslint.config.ts`), but `eslint.config.mjs` lacks ignore rules for vendored shadcn UI components in `src/components/ui/`, causing ESLint and Next.js production builds to fail. Removing the redundant `eslint.config.ts` and configuring `eslint.config.mjs` restores a clean build, typecheck, and lint verification gate.

## Current state

- `commitlint.config.ts:1`:
  ```ts
  import type { UserConfig } from "@commitlint/types";
  ```
- `package.json:116-148`:
  `@commitlint/types` is missing from `devDependencies`.
- `eslint.config.mjs:90-101`:
  Active ESLint flat config lacks ignores for `src/components/ui/**`, `src/next.config.mjs`, and `.next/**`.
- `eslint.config.ts`:
  Redundant obsolete config file shadowed by `eslint.config.mjs`.

## Commands you will need

| Purpose   | Command                         | Expected on success |
| --------- | ------------------------------- | ------------------- |
| Install   | `pnpm add -D @commitlint/types` | exit 0              |
| Typecheck | `pnpm exec tsc --noEmit`        | exit 0, no errors   |
| Lint      | `pnpm exec eslint src/app`      | exit 0, no errors   |
| Build     | `pnpm build`                    | exit 0, compile ok  |

## Scope

**In scope**:

- `package.json`
- `pnpm-lock.yaml`
- `commitlint.config.ts`
- `eslint.config.mjs`
- `eslint.config.ts` (delete)

**Out of scope**:

- Direct modification of UI components under `src/components/ui/`
- Python backend files

## Git workflow

- Branch: `advisor/001-fix-typecheck-build-and-eslint`
- Commits: Conventional commits matching repo style (e.g. `fix: add @commitlint/types and configure eslint ignores for ui`) — note: header must be < 50 chars.

## Steps

### Step 1: Install `@commitlint/types` and add `typecheck` script to `package.json`

1. Run `pnpm add -D @commitlint/types` to add the missing type definitions for commitlint.
2. In `package.json`, ensure `"typecheck": "tsc --noEmit"` is present in the `"scripts"` block.

**Verify**: `pnpm exec tsc --noEmit` → exits with code 0.

### Step 2: Configure `eslint.config.mjs` and remove redundant `eslint.config.ts`

1. Delete `eslint.config.ts`.
2. In `eslint.config.mjs`, add an explicit ignore object to the default export array:
   ```javascript
   export default defineConfig([
     // Ignore files and folders listed in .gitignore
     includeIgnoreFile(gitignorePath),
     {
       ignores: ["src/components/ui/**", "src/next.config.mjs", ".next/**"],
     },
     // JavaScript config
     ...jsConfig,
     // Next.js config
     ...nextConfig,
     // TypeScript config
     ...typescriptConfig,
     // Prettier config
     ...prettierConfig,
   ]);
   ```

**Verify**: `pnpm exec eslint src/app` → exits with 0 errors.

### Step 3: Verify Next.js production build

Run the Next.js production build command to verify both TypeScript compilation and Next.js lint validation succeed.

**Verify**: `pnpm build` → exits with code 0.

## Done criteria

- [ ] `pnpm exec tsc --noEmit` exits 0 with no errors.
- [ ] `pnpm exec eslint src/app` exits 0 with no errors.
- [ ] `pnpm build` completes successfully.
- [ ] `pnpm run typecheck` is available in `package.json` and exits 0.
- [ ] Redundant `eslint.config.ts` is deleted.
- [ ] No files outside the in-scope list are modified (`git status`).

## STOP conditions

- If `pnpm add -D @commitlint/types` fails due to lockfile or network issues, STOP and report.
- If `pnpm build` fails on errors unrelated to `@commitlint/types` or ESLint ignores, STOP and inspect the error trace.

## Maintenance notes

- Any newly generated shadcn components in `src/components/ui/` remain safely excluded from strict ESLint stylistic enforcement.
