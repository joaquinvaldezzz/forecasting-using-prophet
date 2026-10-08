# Food Price Forecasting Web Application

> Full-stack commodity price forecasting platform powered by Next.js 15 and Meta Prophet.

This application provides time-series price predictions and historical trend analysis for agricultural commodities (such as Rice, Corn, Wheat, and Soybeans). The system combines an interactive Next.js frontend with a Python FastAPI service running Meta's Prophet forecasting library.

For a beginner-friendly walkthrough with detailed installation screenshots and troubleshooting tips, refer to [SETUP.md](SETUP.md). For AI coding agents and contributor guardrails, see [AGENTS.md](AGENTS.md).

---

## Key Features

- **Time-Series Forecasting**: Automated commodity price forecasts with trend and seasonality decomposition using Meta Prophet.
- **Interactive Visualizations**: Multi-commodity selection, historical data overlays, and custom year filtering built with Recharts.
- **Client-Side Data Export**: Export forecast datasets and visual charts directly to CSV, PNG, or PDF formats using on-demand dynamic imports.
- **Resilient Data Layer**: Server-side data fetching with graceful fallback to deterministic mock data and timeout safeguards.
- **Automated Verification**: End-to-end test coverage across frontend (Vitest) and backend (Pytest), integrated into GitHub Actions CI.

---

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), [TypeScript 5.9](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives), [Recharts](https://recharts.org/), [TanStack Query](https://tanstack.com/query/latest), [Lucide React](https://lucide.dev/), [Vitest](https://vitest.dev/).
- **Backend**: Python 3.12+, [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), [Prophet](https://facebook.github.io/prophet/), [CmdStanPy](https://cmdstanpy.readthedocs.io/), [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/), [Pytest](https://pytest.org/).
- **Tooling & CI**: [pnpm](https://pnpm.io/), [Prettier](https://prettier.io/), [ESLint 9](https://eslint.org/), [Husky](https://typicode.github.io/husky/), [Commitlint](https://commitlint.js.org/), [GitHub Actions](https://github.com/features/actions).

---

## Project Structure

```text
forecasting-using-prophet/
├── .github/workflows/   # CI/CD workflows (GitHub Actions)
├── back-end/            # FastAPI API & Prophet forecasting service
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

---

## Prerequisites & Configuration

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js (LTS)](https://nodejs.org/en) (v20+)
- [pnpm](https://pnpm.io/installation) (v9+)
- [Python](https://www.python.org/downloads/) (v3.12 or v3.13)

### Environment Configuration

The frontend connects to the FastAPI backend via the `API_BASE_URL` environment variable.

1. Copy the sample environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Configure variables as needed:
   ```bash
   # URL for the Python FastAPI backend (default: http://127.0.0.1:5000)
   API_BASE_URL=http://127.0.0.1:5000
   ```

---

## Quickstart

### 1. Start the Backend Service

In a new terminal window:

```bash
cd back-end

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS / Linux:
source .venv/bin/activate
# On Windows (cmd/PowerShell):
# .venv\Scripts\activate

# Install dependencies
pip3 install -r requirements.txt

# Start FastAPI server
uvicorn main:app --port 5000
# or: python3 main.py
```

The backend server runs at `http://127.0.0.1:5000`.

### 2. Start the Frontend Application

In a separate terminal window:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:3000` in your browser.

---

## Scripts & Verification

| Command                        | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| `pnpm dev`                     | Start Next.js development server with Turbopack        |
| `pnpm build`                   | Create production build                                |
| `pnpm start`                   | Start Next.js production server                        |
| `pnpm typecheck`               | Run TypeScript compiler type checking (`tsc --noEmit`) |
| `pnpm test`                    | Run frontend unit and component tests with Vitest      |
| `pnpm lint`                    | Run ESLint checks                                      |
| `pnpm lint:fix`                | Fix autofixable ESLint errors                          |
| `pnpm format`                  | Format repository files using Prettier                 |
| `pytest back-end/test_main.py` | Run backend API test suite                             |

---

## Testing & Continuous Integration

This project uses automated verification gates:

- **Frontend Tests**: Executed via Vitest (`pnpm test`), covering utility functions, API clients, and React components.
- **Backend Tests**: Executed via Pytest (`pytest back-end/test_main.py`), covering Prophet forecasting endpoints, data formatting, and fallback logic.
- **Continuous Integration**: GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request, validating typechecking, frontend tests, and backend tests.

---

## Contributing & Commit Standards

We enforce Conventional Commits using Husky and Commitlint.

- Format: `<type>(<optional scope>): <subject>` (e.g., `feat: add price confidence interval chart`)
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Constraint**: The commit header subject line must be 50 characters or fewer.
