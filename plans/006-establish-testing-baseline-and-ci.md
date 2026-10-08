# Plan 006: Establish Automated Testing Baseline and CI Workflow

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 6e6c375..HEAD -- package.json .github/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-build-and-eslint.md, plans/002-deterministic-backend-data-and-seeding.md
- **Category**: tests
- **Planned at**: commit `6e6c375`, 2026-10-08

## Why this matters

The repository currently lacks any automated testing infrastructure. There are no test scripts in `package.json`, no test runner installed (like Vitest or Jest), no backend pytest tests for the Flask endpoints, and no GitHub Actions CI workflow to validate PRs. Without automated tests, breaking changes to forecasting response schemas, formatting utilities, or chart calculations can slip into production undetected.

## Current state

- `package.json:5-12`:
  ```json
  "scripts": {
    "build": "next build",
    "dev": "next dev --turbopack",
    "format": "prettier --write .",
    "lint": "next lint",
    "prepare": "husky",
    "start": "next start"
  }
  ```
  No `test` script exists.
- `.github/`:
  No CI workflow files in `.github/workflows/`.

## Commands you will need

| Purpose        | Command                                         | Expected on success  |
| -------------- | ----------------------------------------------- | -------------------- |
| Install        | `pnpm add -D vitest @vitejs/plugin-react jsdom` | exit 0               |
| Frontend tests | `pnpm test`                                     | all test suites pass |
| Backend tests  | `pytest back-end`                               | all tests pass       |

## Scope

**In scope**:

- `package.json`
- `vitest.config.ts` (create)
- `src/lib/__tests__/utils.test.ts` (create)
- `src/lib/__tests__/chart-export.test.ts` (create)
- `back-end/test_main.py` (create)
- `.github/workflows/ci.yml` (create)

**Out of scope**:

- End-to-end browser automation (Playwright/Cypress deferred to a future milestone)

## Git workflow

- Branch: `advisor/006-establish-testing-baseline-and-ci`
- Commits: Conventional commit (e.g. `test: add vitest for frontend, pytest for backend, and CI workflow`)

## Steps

### Step 1: Install Vitest and configure test script

1. Install Vitest and testing environment:
   ```bash
   pnpm add -D vitest @vitejs/plugin-react jsdom
   ```
2. Create `vitest.config.ts`:

   ```ts
   import path from "path";
   import react from "@vitejs/plugin-react";
   import { defineConfig } from "vitest/config";

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: "jsdom",
       globals: true,
     },
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   });
   ```

3. Add `"test": "vitest run"` to `"scripts"` in `package.json`.

**Verify**: `pnpm test` runs (reports no tests or executes initial suite).

### Step 2: Write unit tests for frontend utilities

1. Create `src/lib/__tests__/utils.test.ts`:
   - Test `cn()` class merging.
   - Test `formatAsCurrency()` with standard numbers, zero, and decimals.
2. Create `src/lib/__tests__/chart-export.test.ts`:
   - Test `exportChartToCSV()` handles empty array without crashing.

**Verify**: `pnpm test` → all tests pass.

### Step 3: Write backend endpoint tests with pytest

Create `back-end/test_main.py`:

```python
import pytest
from main import app, commodities

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Hello!' in response.data

def test_get_commodities(client):
    response = client.get('/api/commodities')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert 'rice' in data

def test_get_insights(client):
    response = client.get('/api/insights')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == len(commodities)
    for item in data:
        assert 'commodity' in item
        assert 'current_price' in item
        assert 'trend' in item

def test_get_price_trends_valid_year(client):
    response = client.get('/api/price-trends/2023')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 12

def test_get_price_trends_invalid_year(client):
    response = client.get('/api/price-trends/1990')
    assert response.status_code == 400
```

**Verify**: `pytest back-end/test_main.py` → 5 passed.

### Step 4: Add GitHub Actions CI workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec tsc --noEmit
      - run: pnpm test
      - run: pnpm build

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"
      - run: pip install -r back-end/requirements.txt pytest
      - run: pytest back-end/test_main.py
```

## Done criteria

- [ ] `pnpm test` runs and passes on frontend.
- [ ] `pytest back-end/test_main.py` passes all backend tests.
- [ ] `.github/workflows/ci.yml` is committed and checks build, typecheck, and test suites.
- [ ] `plans/README.md` status row updated to DONE.

## STOP conditions

- If `vitest` encounters module resolution issues with `@/*` aliases, verify `vitest.config.ts` path alias configuration.

## Maintenance notes

- Add new component and endpoint tests as new forecasting features or metrics are introduced.
