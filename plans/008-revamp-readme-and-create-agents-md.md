# Plan 008: Revamp README.md and Create AGENTS.md

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 88c0a94..HEAD -- README.md AGENTS.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-build-and-eslint.md, plans/006-establish-testing-baseline-and-ci.md
- **Category**: docs
- **Planned at**: commit `88c0a94`, 2026-10-08

## Why this matters

The existing `README.md` was written when the repository was an early prototype. It lacks documentation for recently implemented systems including the Vitest/Pytest testing suites, the GitHub Actions CI pipeline, environment variable configuration (`API_BASE_URL`), the complete list of pnpm development scripts, and the project architecture. Additionally, there is no `AGENTS.md` file to guide AI coding assistants with repository conventions, verification gates, commit constraints (such as the 50-character commitlint header limit), and architectural boundaries.

Revamping `README.md` and adding `AGENTS.md` establishes a clear, professional onboarding guide for human developers and structured guardrails for AI agents.

## Current state

- `README.md:1-80`: Minimal initial README covering basic clone and run steps for the initial prototype, missing testing, CI, environment variables, full scripts table, architecture layout, and features.
- `AGENTS.md`: Does not exist.
- `package.json:5-15`:
  ```json
  "scripts": {
    "build": "next build",
    "dev": "next dev --turbopack",
    "format": "prettier --write .",
    "lint": "eslint --ext .ts,.tsx --cache",
    "lint:fix": "eslint --ext .ts,.tsx --fix --cache",
    "prepare": "husky",
    "start": "next start",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
  ```
- `commitlint.config.ts:6`:
  ```ts
  "header-max-length": [2, "always", 50], // subject line must be <= 50 chars
  ```
- `.github/workflows/ci.yml:1-34`: CI runs frontend typecheck (`tsc --noEmit`), frontend tests (`pnpm test`), and backend tests (`pytest back-end/test_main.py`).

## Commands you will need

| Purpose        | Command                        | Expected on success |
| -------------- | ------------------------------ | ------------------- |
| Check files    | `ls -la README.md AGENTS.md`   | both files exist    |
| Formatting     | `pnpm format`                  | exit 0              |
| Frontend tests | `pnpm test`                    | all tests pass      |
| Typecheck      | `pnpm typecheck`               | exit 0              |
| Backend tests  | `pytest back-end/test_main.py` | all 5 tests pass    |

## Scope

**In scope**:

- `README.md` (rewrite/revamp)
- `AGENTS.md` (create)

**Out of scope**:

- `SETUP.md` (keep intact as beginner walkthrough)
- Any source code files under `src/` or `back-end/`

## Git workflow

- Branch: `advisor/008-revamp-readme-and-create-agents-md`
- Commit message style: Conventional Commits with max 50 chars header (e.g. `docs: revamp README and create AGENTS.md`).
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Revamp `README.md`

Replace `README.md` with comprehensive, clean, professional documentation following antislop principles (direct, informative, no fluffy marketing buzzwords).

The content must include:

1. **Title & Tagline**: Food Price Forecasting Web Application (Next.js 15 & Meta Prophet).
2. **Overview**: Description of the full-stack system (Next.js 15 frontend with interactive time-series visualizations; Python Flask backend using Meta's Prophet library).
3. **Key Features**:
   - Time-series commodity price forecasting with trend and seasonality decomposition.
   - Interactive Recharts charts with commodity selection, historical trend overlays, and year filtering.
   - Client-side export to CSV and PDF/PNG (via dynamic imports).
   - Resilient server-side data fetching with fallback mock data and timeout safeguards.
   - Comprehensive test coverage with Vitest and Pytest, automated via GitHub Actions CI.
4. **Tech Stack**:
   - **Frontend**: Next.js 15 (App Router, Turbopack), React 19, TypeScript 5.9, Tailwind CSS v4, shadcn/ui (Radix UI primitives), Recharts, TanStack Query, Lucide Icons, Vitest.
   - **Backend**: Python 3.12+, Flask, Prophet, CmdStanPy, Pandas, NumPy, Pytest.
   - **Tooling**: pnpm, Prettier, ESLint 9, Husky, Commitlint, GitHub Actions.
5. **Project Architecture & Directory Layout**:
   ```text
   forecasting-using-prophet/
   ├── .github/workflows/   # CI/CD workflows (GitHub Actions)
   ├── back-end/            # Flask API & Prophet forecasting service
   │   ├── main.py          # API endpoints & forecasting logic
   │   ├── requirements.txt # Python dependencies
   │   └── test_main.py     # Backend Pytest test suite
   ├── plans/               # Structured implementation & advisory plans
   ├── public/              # Static assets
   ├── src/
   │   ├── app/             # Next.js 15 App Router pages & layouts
   │   ├── components/      # UI, layout, dashboard & forecast components
   │   ├── hooks/           # Custom React hooks
   │   └── lib/             # API client, export utils, and test suites
   ├── SETUP.md             # Step-by-step setup guide for beginners
   ├── AGENTS.md            # Agent and contributor instructions
   └── README.md            # Project documentation
   ```
6. **Prerequisites & Configuration**:
   - Node.js LTS, pnpm, Python 3.12+, Git.
   - Environment variables: `.env.example` -> `API_BASE_URL` (defaults to `http://127.0.0.1:5000`).
   - Mention `SETUP.md` for a beginner-oriented guide.
7. **Quickstart Guide**:
   - Backend commands (venv creation, requirements install, start server).
   - Frontend commands (`pnpm install`, `pnpm dev`).
8. **Scripts & Verification Table**:
   - Full list of npm scripts (`dev`, `build`, `start`, `typecheck`, `test`, `lint`, `format`).
   - Backend test command (`pytest back-end/test_main.py`).
9. **Testing & CI**:
   - Description of Vitest frontend tests, Pytest backend tests, and GitHub Actions CI.
10. **Contributing & Conventional Commits**:
    - Mention commitlint rule requiring subject lines <= 50 characters.

**Verify**: `test -f README.md && grep -q "AGENTS.md" README.md && grep -q "API_BASE_URL" README.md` -> exits 0

---

### Step 2: Create `AGENTS.md`

Create `AGENTS.md` in the repository root to provide clear rules, context, and verification gates for AI agents and automated coding tools working on this codebase.

The content must include:

1. **Overview**: Purpose of `AGENTS.md` and high-level architecture of the repository.
2. **Commands & Verification Gates**:
   - Verification commands table:
     - `pnpm typecheck` (must exit 0)
     - `pnpm test` (all unit tests pass)
     - `pnpm lint` (ESLint check)
     - `pnpm format` (Prettier formatting)
     - `pytest back-end/test_main.py` (all backend API tests pass)
3. **Repository Conventions & Style Guidelines**:
   - **TypeScript & React**: Strict types (no loose `any`), React 19 & Next.js 15 conventions, Server Components default, `"use client"` only when stateful or interactive.
   - **Performance Best Practices**: Dynamic imports for heavy client libraries (`html2canvas`, `jspdf`), avoid inline object allocations in React context providers, memoize expensive calculations.
   - **UI & Styling**: Tailwind CSS v4 design tokens, standard shadcn/ui components in `src/components/ui/`, accessible semantics and contrast.
   - **Backend**: Flask endpoints in `back-end/main.py`, deterministic seeding for mock/synthetic data, Pytest unit tests in `back-end/test_main.py`.
   - **Code & Prose Hygiene (Antislop)**: Direct, clear comments explaining non-obvious logic only. Never add decorative AI slop or restate what code already expresses.
4. **Git & Commit Guidelines**:
   - Conventional Commits (`feat:`, `fix:`, `docs:`, `perf:`, `test:`, `chore:`, `refactor:`).
   - Subject header max length: 50 characters (enforced by commitlint).
5. **Agent Safety Guardrails**:
   - Read-only on source files when acting in advisory mode.
   - Never commit secret credentials or tokens.
   - Run verification commands before considering any change complete.

**Verify**: `test -f AGENTS.md && grep -q "Verification Gates" AGENTS.md && grep -q "commitlint" AGENTS.md` -> exits 0

---

### Step 3: Format and Validate Files

Run Prettier to format markdown files and verify repository health.

```bash
pnpm format
pnpm typecheck
pnpm test
pytest back-end/test_main.py
```

**Verify**: All commands succeed with exit code 0.

## Test plan

- Documentation structure validation: Check that `README.md` and `AGENTS.md` contain all referenced sections, correct command references, accurate architecture diagrams, and valid relative links (`SETUP.md`, `AGENTS.md`, `plans/README.md`).
- Formatting validation: `pnpm format` formats the files without syntax or prettier errors.
- Baseline verification: `pnpm typecheck`, `pnpm test`, and `pytest back-end/test_main.py` continue to pass.

## Done criteria

- [ ] `README.md` is updated with complete architecture, features, tech stack, quickstart, scripts, and CI details.
- [ ] `AGENTS.md` is created with architecture context, verification gates, style rules, commit constraints, and safety guardrails.
- [ ] `pnpm format` exits 0.
- [ ] `pnpm typecheck` exits 0.
- [ ] `pnpm test` exits 0.
- [ ] `pytest back-end/test_main.py` exits 0.
- [ ] No files outside the in-scope list are modified.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

- If `README.md` or `SETUP.md` references non-existent files or removed dependencies, STOP and align the references.
- If formatting or linting detects broken markdown or table syntax, correct it before proceeding.

## Maintenance notes

- Future additions of new API endpoints or frontend routes should be documented in both `README.md` and `AGENTS.md`.
- If new verification tools or linters are added (e.g., Python linter), update the verification gates in `AGENTS.md` accordingly.
