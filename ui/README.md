Starter UI

A lightweight, framework-free UI scaffold with modern styling, components, and a tiny router.

Run locally

- Option A: Using Python (no deps)
  - `python3 -m http.server 5173 -d /workspace/ui`
  - Open `http://localhost:5173` in your browser

- Option B: Using any static server
  - Serve the `/workspace/ui` directory

Project structure

- `index.html`: Entry point
- `styles.css`: Global styles
- `app.js`: App bootstrap
- `router.js`: Minimal hash-based router
- `components/`: UI components (`Navbar`, `Card`, `Modal`)
- `pages/`: Route pages (`Home`, `About`, `Settings`)
- `assets/`: SVG assets

Shortcuts

- Press `Ctrl/Cmd + K` for the example Command Palette modal.