# Plan 009: Migrate Backend Microservice from Flask to FastAPI

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat fc74940..HEAD -- back-end/main.py back-end/test_main.py back-end/requirements.txt AGENTS.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: migration
- **Planned at**: commit `fc74940`, 2026-10-08

## Why this matters

The existing Python backend is built with Flask 3.1, relying on manual string splitting, unstructured query parameter parsing, and unvalidated dictionary returns. Migrating to FastAPI with Pydantic v2 introduces typed request validation, automatic OpenAPI/Swagger documentation (`/docs`), standardized error schemas, and native ASGI execution via Uvicorn. Furthermore, FastAPI's synchronous route handling model automatically offloads CPU-bound Prophet forecasting calls to worker threads, preventing event-loop starvation while keeping the API contract identical for the Next.js frontend.

## Current state

- Relevant files:
  - `back-end/main.py` — Flask app defining mock data generation, Prophet model fitting on startup, and endpoints (`/`, `/api/forecast`, `/api/commodities`, `/api/insights`, `/api/price-trends/<year>`).
  - `back-end/test_main.py` — Pytest suite using Flask `app.test_client()`.
  - `back-end/requirements.txt` — Python dependencies including `Flask==3.1.1`, `flask-cors==6.0.0`, and `Werkzeug==3.1.3`.
  - `AGENTS.md` — Guidance mentioning Flask startup command and backend overview.
- Current endpoint implementations in `back-end/main.py:64-174`:
  ```python
  @app.route("/api/forecast", methods=['GET'])
  def get_forecast():
      raw_commodities = request.args.get('commodities', '').strip()
      ...
  ```
- Current test pattern in `back-end/test_main.py:8-13`:
  ```python
  @pytest.fixture
  def client():
      app.config['TESTING'] = True
      with app.test_client() as client:
          yield client
  ```
- Frontend client in `src/lib/api-client.ts:1-2`:
  ```typescript
  const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:5000";
  ```
  The endpoint routes (`/`, `/api/forecast`, `/api/commodities`, `/api/insights`, `/api/price-trends/{year}`) and their response payload shapes must remain strictly backward compatible.

## Commands you will need

| Purpose            | Command                                                            | Expected on success                     |
| ------------------ | ------------------------------------------------------------------ | --------------------------------------- |
| Backend Tests      | `pytest back-end/test_main.py`                                     | exit 0, all 5+ test cases pass          |
| Frontend Tests     | `pnpm test`                                                        | exit 0, all Vitest test suites pass     |
| Frontend Typecheck | `pnpm typecheck`                                                   | exit 0, no TypeScript diagnostics       |
| Backend Server     | `uvicorn main:app --app-dir back-end --host 127.0.0.1 --port 5000` | starts Uvicorn ASGI server on port 5000 |

## Scope

**In scope**:

- `back-end/main.py` — Refactor to FastAPI application with Pydantic schemas, lifespan model training, and CORS middleware.
- `back-end/test_main.py` — Refactor Pytest fixtures from Flask `test_client` to `fastapi.testclient.TestClient`.
- `back-end/requirements.txt` — Add `fastapi`, `uvicorn[standard]`, `pydantic`, `httpx`; remove `Flask`, `flask-cors`, `Werkzeug`.
- `AGENTS.md` — Update backend references and startup command from Flask to FastAPI / Uvicorn.
- `README.md` — Update backend setup instructions to reference FastAPI and Uvicorn.

**Out of scope**:

- Changing response JSON key structures or date formatting (`%Y-%m-%d`, `%b`) expected by Next.js components.
- Modifying frontend fetching logic in `src/lib/api-client.ts` or React components.
- Changing Prophet hyperparameters or mock dataset generation algorithms in `generate_mock_data`.

## Git workflow

- Branch: `advisor/009-migrate-backend-from-flask-to-fastapi`
- Commit per step or per logical unit; message style: `feat(backend): migrate from flask to fastapi and pydantic` (max 50 chars).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Update Python dependencies in `back-end/requirements.txt`

Add the FastAPI ecosystem packages and remove Flask-specific libraries:

- Add `fastapi>=0.115.0`, `uvicorn[standard]>=0.30.0`, `pydantic>=2.8.0`, `httpx>=0.27.0`.
- Remove `Flask`, `flask-cors`, `Werkzeug`, `itsdangerous`, `blinker`.
- Retain all data science and prophet dependencies (`prophet`, `cmdstanpy`, `pandas`, `numpy`, `holidays`, etc.).

**Verify**: `pip install -r back-end/requirements.txt` (or inside `.venv`) → exit 0.

### Step 2: Implement FastAPI app and Pydantic response models in `back-end/main.py`

Refactor `back-end/main.py`:

1. Use FastAPI's `lifespan` context manager (`@asynccontextmanager`) to train Prophet models on startup.
2. Add `CORSMiddleware` with `allow_origins=["*"]`, `allow_credentials=True`, `allow_methods=["*"]`, `allow_headers=["*"]`.
3. Define Pydantic models for response clarity:
   - `InsightItem(commodity: str, current_price: float, average_price: float, price_change: float, trend: str)`
   - `PriceTrendItem(month: str, rice: float, vegetables: float, meat: float)`
   - `HistoricalPoint(ds: str, price: float)`
   - `ForecastPoint(ds: str, price: float, lower_bound: float, upper_bound: float)`
   - `CommodityForecast(historical: list[HistoricalPoint], forecast: list[ForecastPoint])`
4. Define endpoints as standard `def` (synchronous) so FastAPI automatically runs CPU-bound Prophet forecasting on threadpool workers:
   - `GET /` -> returns plain text `"Hello!"` (or `{"message": "Hello!"}` / `PlainTextResponse("Hello!")` to match existing test).
   - `GET /api/commodities` -> returns `list[str]`.
   - `GET /api/insights` -> returns `list[InsightItem]`.
   - `GET /api/price-trends/{year}` -> validates `year: int = Path(..., ge=2018, le=2025)` or returns `HTTPException(status_code=400, detail="Year out of range")`.
   - `GET /api/forecast` -> parses `commodities: str | None = Query(default=None)`, returns `dict[str, CommodityForecast]` or raises `HTTPException(status_code=400, detail="Invalid commodities: ...")`.
5. Support local direct execution via `if __name__ == "__main__": uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)`.

**Verify**: `python3 -c "import main; print(main.app.title)"` → executes without error.

### Step 3: Refactor backend tests in `back-end/test_main.py`

Update `back-end/test_main.py` to use `fastapi.testclient.TestClient`:

1. Replace Flask client fixture:
   ```python
   from fastapi.testclient import TestClient
   from main import app, commodities

   @pytest.fixture
   def client():
       with TestClient(app) as c:
           yield c
   ```
2. Update tests to use `response.json()` instead of `response.get_json()`.
3. Verify test assertions:
   - `test_index`: assert `response.status_code == 200` and `"Hello!" in response.text`
   - `test_get_commodities`: assert `isinstance(data, list)` and `'rice' in data`
   - `test_get_insights`: assert structure and fields
   - `test_get_price_trends_valid_year`: returns 12 months for 2023
   - `test_get_price_trends_invalid_year`: assert 400 or 422 for invalid year
   - Add new test `test_get_forecast_valid_and_invalid`: verifies `/api/forecast?commodities=rice` and 400 on invalid commodity.

**Verify**: `pytest back-end/test_main.py` → exit 0, all tests pass.

### Step 4: Update documentation in `AGENTS.md` and `README.md`

Update references to Flask across docs:

1. `AGENTS.md`: Update Overview table and section 2 (`uvicorn main:app --app-dir back-end --port 5000` or `python3 back-end/main.py`).
2. `README.md`: Update microservice architecture description and setup instructions.

**Verify**: `pnpm lint` and `pnpm test` → all exit 0.

## Test plan

- Test coverage:
  - Root route `GET /` returns 200 and text `Hello!`.
  - `GET /api/commodities` returns array of strings `['rice', 'vegetables', 'meat']`.
  - `GET /api/insights` returns insight dictionaries with `commodity`, `current_price`, `average_price`, `price_change`, `trend`.
  - `GET /api/price-trends/2023` returns 12 monthly data points.
  - `GET /api/price-trends/1990` returns status 400.
  - `GET /api/forecast?commodities=rice` returns `rice` forecast object with historical and forecast series.
  - `GET /api/forecast?commodities=invalid_item` returns status 400.
- Pattern: Model test cases after existing `back-end/test_main.py` using `TestClient(app)`.
- Verification command: `pytest back-end/test_main.py`

## Done criteria

- [ ] `pytest back-end/test_main.py` passes all test cases cleanly.
- [ ] `pnpm typecheck` exits 0 with no TypeScript errors.
- [ ] `pnpm test` exits 0 with all frontend tests passing.
- [ ] `grep -rn "Flask" back-end/` returns no active framework references in code.
- [ ] Backend runs on port 5000 with interactive docs at `http://127.0.0.1:5000/docs`.
- [ ] No files outside in-scope list are modified.
- [ ] `plans/README.md` status row updated.

## STOP conditions

- Stop and report back (do not improvise) if:
  - Prophet or CmdStanPy fails to fit models inside FastAPI's `lifespan` context.
  - Pydantic schema validation serializes dates or floating point numbers in a format incompatible with Next.js frontend charts.
  - The Next.js frontend build or test suites fail due to unexpected API response schema changes.

## Maintenance notes

- When adding new commodity forecast models, define corresponding Pydantic schemas in `main.py` to maintain automated documentation in Swagger UI (`/docs`).
- Keep forecast endpoint functions as synchronous `def` unless offloading Prophet model execution to external task queues (e.g. Celery / Redis Queue), since Prophet's Stan C++ routines are CPU-bound.
