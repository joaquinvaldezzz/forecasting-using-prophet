# Setup Guide for Food Price Forecasting App

This guide will help you set up the Food Price Forecasting app on your computer. No programming experience needed — we'll explain everything in simple terms.

## What is this app?

This web app helps predict food prices. It has two main parts:

- A website where you can view predictions
- A program that runs the calculations

## Before you begin

You'll need to install some free programs on your computer. These are the basic tools needed to run the app. Here's what you need:

1. **Git** (Helps download the app)

   - Visit [https://git-scm.com/downloads](https://git-scm.com/downloads)
   - Click the download button for your computer (Windows/Mac/Linux)
   - Run the installer and follow the instructions
   - To check if it worked, open your command prompt and type: `git --version`

2. **Node.js** (Helps run the website)

   - Go to [https://nodejs.org/en](https://nodejs.org/en)
   - Click the green "LTS" button to download
   - Run the installer and follow the instructions
   - To check if it worked, open command prompt and type: `node --version`

3. **pnpm** (Helps manage website files)

   - Open command prompt
   - Type this command and press Enter: `npm install -g pnpm`
   - To check if it worked, type: `pnpm --version`

4. **Python** (Helps run the calculations)

   - Go to [https://www.python.org/downloads/release/python-3132](https://www.python.org/downloads/release/python-3132)
   - Scroll down to the Files section
   - Download the installer for your computer
   - Run the installer and follow the instructions
   - **Important**: Check the box that says "Add Python to PATH"
   - To check if it worked, open command prompt and type: `python3 --version`

5. **Visual Studio Code** (A helpful text editor)
   - Download from [https://code.visualstudio.com/download](https://code.visualstudio.com/download)
   - Install it like any other program
   - This is optional but helpful

## How to open Command Prompt?

- **Windows**: Press `Windows key + R`, type "cmd" and press Enter
- **Mac**: Press `Command + Space`, type "Terminal" and press Enter

## Setting up the app

### Step 1: Download the app

1. Open command prompt
2. Copy and paste these commands one at a time:

   ```bash
   git clone https://github.com/joaquinvaldezzz/forecasting-using-prophet.git
   ```

   ```bash
   cd forecasting-using-prophet
   ```

### Step 2: Set up the website

1. In the same command prompt, type:

   ```bash
   pnpm install
   ```

   This will take a few minutes. It's downloading the website files.

### Step 3: Set up the calculations

1. Type this command:

   ```bash
   cd back-end
   ```

2. Create a Python environment (this keeps things organized):

   For Windows:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

   For Mac:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install the Python files:

   ```bash
   pip3 install -r requirements.txt
   ```

   This will take a few minutes.

## Running the app

You'll need two command prompt windows:

### Window 1 (For calculations):

1. Make sure you're in the `back-end` folder
2. Type:

   ```bash
   python3 main.py
   ```

3. You'll see a message saying the server is running

### Window 2 (For website):

1. Go back to the main folder
2. Type:

   ```bash
   pnpm run dev
   ```

3. Wait for the message saying the website is ready

### Viewing the app:

1. Open your web browser (Chrome, Firefox, etc.)
2. Type this in the address bar: `http://localhost:3000`
3. You'll see the Food Price Forecasting app!

## If something goes wrong

### Common problems and solutions:

1. **Website doesn't start**

   - Check if you typed all commands correctly
   - Try closing and reopening command prompt
   - Make sure you're in the right folder

2. **Python problems**

   - Check if you selected "Add Python to PATH" during installation
   - Try closing and reopening command prompt
   - On Windows, you might need to run PowerShell as administrator

3. **Can't see the website**

   - Check if both command prompt windows are running
   - Make sure you typed the correct address in your browser
   - Try a different web browser

### Need more help?

If you're still stuck:

1. Take a screenshot of any error messages
2. Message me on Facebook: [Joaquin Valdez](https://www.facebook.com/joaquin.valdezzz)
3. If you're not on Facebook, email me at [valdez.johnjoaquin.13579@gmail.com](mailto:valdez.johnjoaquin.13579@gmail.com). I'll get back to you as soon as I can.

## Useful links

- [Next.js](https://nextjs.org/docs) — The framework we use for the website
- [Prophet](https://facebook.github.io/prophet/docs/quick_start.html) — The library we use for calculations
- [Tailwind CSS](https://tailwindcss.com/docs) — The CSS framework we use for styling
- [shadcn/ui](https://ui.shadcn.com) — The UI library we use for components
