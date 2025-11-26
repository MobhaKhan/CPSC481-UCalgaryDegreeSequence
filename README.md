# Program Sequence Guide

This repo hosts a classic static experience for the University of Calgary degree planner. The UI is rendered with vanilla JavaScript, CSS, and a JSON data file so you can view it without a bundler.

## Running locally

1. Install dependencies (the server uses Node's built-in APIs):

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open `http://localhost:3000` and compare the interface against your mockups.

Course data lives in `public/data/program.json`, the degree requirements page is rendered by `public/degree.js`, and the separate planner screen is rendered by `public/planner.js`. Styles sit in `public/styles.css`. Use `http://localhost:3000` (degree requirements) and click the “Planner” button to explore the planner page.
