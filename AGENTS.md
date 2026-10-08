# AGENTS.md

> Guidance, conventions, verification gates, and safety guardrails for AI coding assistants and contributors working on this codebase.

## 1. Overview & Architecture

This repository is a full-stack commodity price forecasting application. It consists of:

- **Frontend (`src/`)**: Next.js 15 (App Router, Turbopack) with React 19, TypeScript 5.9, Tailwind CSS v4, shadcn/ui (Radix UI primitives), Recharts, and TanStack Query.
- **Backend (`back-end/`)**: Python FastAPI microservice utilizing Meta's Prophet library and CmdStanPy for time-series forecasting and trend decomposition.
- **Documentation & Plans (`plans/`, `SETUP.md`, `README.md`)**: Structured roadmap, architecture documentation, and developer setup instructions.

---

## 2. Verification Gates & Essential Commands

Always verify changes using the relevant commands before reporting completion.

| Gate / Action  | Command                                           | Success Criteria                             |
| -------------- | ------------------------------------------------- | -------------------------------------------- |
| Typecheck      | `pnpm typecheck`                                  | Exit code 0, no TypeScript diagnostics       |
| Frontend Tests | `pnpm test`                                       | Exit code 0, all Vitest test suites pass     |
| Backend Tests  | `pytest back-end/test_main.py`                    | Exit code 0, all Pytest test cases pass      |
| Linting        | `pnpm lint`                                       | Exit code 0, no ESLint errors                |
| Formatting     | `pnpm format`                                     | Exit code 0, all files formatted             |
| Dev Server     | `pnpm dev`                                        | Starts Next.js dev server on port 3000       |
| Backend Server | `uvicorn main:app --app-dir back-end --port 5000` | Starts FastAPI / Uvicorn server on port 5000 |

---

## 3. Repository Conventions & Style Guidelines

### TypeScript & React

- **Strict Typing**: Maintain strict type definitions across all files. Do not use `any` or loose index signatures without explicit justification.
- **React 19 & Next.js 15 Standards**:
  - Prefer React Server Components (RSC) by default.
  - Mark files with `"use client"` only when interactive state, browser APIs, or custom React hooks are required.
  - Colocate components logically within `src/components/` by feature domain (`dashboard/`, `forecast/`, `layout/`, `ui/`).

### Performance Best Practices

- **Dynamic Imports for Heavy Bundles**: Keep client bundle size minimal. Dynamic dependencies such as `html2canvas` and `jspdf` should be loaded on demand via dynamic `import(...)` rather than top-level module imports.
- **Stable Context & State**: Avoid inline object or function allocations in React Context providers; memoize values with `useMemo` and `useCallback` when consumed by multiple subtree components.
- **Efficient Recharts Rendering**: Optimize data arrays and avoid heavy transformations during render passes.

### UI & Styling

- **Tailwind CSS v4 & shadcn/ui**: Use Tailwind utility classes with custom theme variables defined in `src/app/globals.css`.
- **Component Primitives**: Use base UI components in `src/components/ui/` built upon Radix UI primitives.
- **Accessibility & Contrast**: Ensure keyboard navigation and accessible color contrast across all dashboard views and interactive controls.

### Backend & Python

- **FastAPI Endpoints**: Place API endpoints and Pydantic schemas in `back-end/main.py`.
- **Deterministic Seeding**: When generating synthetic data or simulation series, always use fixed seeds (`numpy.random.seed`, `random.seed`) to ensure idempotent results across test runs.
- **Pytest Suite**: Maintain test cases in `back-end/test_main.py` for all endpoints and forecasting transformations.

### Code & Prose Hygiene (Antislop)

- Write concise, purposeful code comments that explain _why_ non-obvious logic exists rather than restating _what_ the code does.
- Avoid decorative comments, robotic summaries, and buzzword-laden documentation.
- Preserve existing docstrings and comments unless specifically asked to refactor them.

---

## 4. Git & Commit Guidelines

- **Conventional Commits**: All commit messages must follow the Conventional Commits specification:
  - Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Subject Length Limit**: The commit header subject line must be **50 characters or fewer** (strictly enforced by commitlint).
  - Example: `docs: revamp README and create AGENTS.md`

---

## 5. Agent Safety Guardrails

- **Scope Adherence**: Only modify files explicitly within the assigned task or plan scope.
- **Advisory Mode**: When operating in advisory or planning roles, maintain read-only access to source code.
- **Secrets Management**: Never commit API keys, tokens, or environment credentials. Use `.env.example` as a template for environment variables.
- **Verification Before Handoff**: Run all relevant test and typecheck verification commands before reporting completion.
