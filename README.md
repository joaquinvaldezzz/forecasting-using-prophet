# Food Price Forecasting using Python

This project is a simple web app for forecasting food prices using the [Prophet](https://facebook.github.io/prophet) library. The frontend is built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com), while the backend uses [Python](https://www.python.org).

## Prerequisites

- [Git](https://git-scm.com/downloads) — A version control system for tracking changes in your codebase.
- [Node.js (LTS)](https://nodejs.org/en) — A JavaScript runtime for running code outside the browser.
- [pnpm](https://pnpm.io/installation#using-npm) — A fast, disk-efficient package manager for Node.js.
- [Python (3.13.2)](https://www.python.org/downloads/release/python-3132) — Used for the backend to train the model and make predictions.
- [Visual Studio Code](https://code.visualstudio.com/download) — A code editor for writing and editing code, or use any editor you prefer.

## Local installation

1. [Download](https://github.com/joaquinvaldezzz/forecasting-using-prophet/archive/refs/heads/main.zip) or clone the repository:

   ```bash
   git clone https://github.com/joaquinvaldezzz/forecasting-using-prophet.git
   ```

2. Navigate to the project directory:

   ```bash
   cd forecasting-using-prophet
   ```

3. Install frontend dependencies:

   ```bash
   pnpm install
   ```

4. Go to the back-end directory:

   ```bash
   cd back-end
   ```

5. Activate the virtual environment:

   ```bash
   source .venv/bin/activate
   ```

   If you're on Windows, use:

   ```bash
   source .venv\Scripts\activate
   ```

6. Install Python dependencies:

   ```bash
   pip3 install -r requirements.txt
   ```

7. Start the server:

   ```bash
   python3 main.py
   ```

8. In a new terminal, return to the root directory if needed, then start the front-end development server:

   ```bash
   pnpm run dev
   ```

9. Open your browser and go to `http://localhost:3000` to view the app.

For more details, check out the [Next.js documentation](https://nextjs.org/docs).
