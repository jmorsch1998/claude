# Cub Scout — CFOP Training Timer

A lightweight single-page app for speed-training Rubik's cube CFOP solves with split tracking, stats, and auto-generated drill sessions.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Controls

### Timer
- **Hold spacebar** (300ms) until the display turns green, then **release** to start
- **Tap spacebar** to stop (or record the next split in split mode)
- On mobile, **tap and hold** the timer display instead of spacebar

### Split Mode
Toggle "Splits ON" to track CFOP phases individually:
1. Release spacebar to start the timer (Cross phase begins)
2. Tap spacebar → records Cross time, starts F2L
3. Tap spacebar → records F2L time, starts OLL
4. Tap spacebar → records OLL time, starts PLL
5. Tap spacebar → records PLL time and stops the timer

### After a Solve
- Add optional notes and tags (comma-separated)
- Press Enter or click Save
- Press Escape or click Discard to throw it away

### Keyboard Safety
Spacebar only triggers the timer when focus is NOT in a text input. If you hit spacebar while typing, a toast warning appears instead.

## Features

### Stats Dashboard
- **Ao5 / Ao12**: Rolling averages of your last 5 and 12 solves
- **Session Avg**: Average of all solves
- **Best**: Your fastest solve
- **Phase Breakdown**: Average time, standard deviation, and percentage for each CFOP phase (Cross, F2L, OLL, PLL)

### Pause Detection
Solves with unusually slow phases (>2.5x the recent median for that phase) are flagged with an orange highlight in the recent solves table.

### Auto-Drill Generator
After 8+ solves with split data, a "Next Training Session" plan appears with 3 practice blocks targeting your weakest phase:
- **Cross weak** → Cross-only reps, Cross+1 pair, full solves with cross focus
- **F2L weak** → First pair finder, F2L-only timed practice, full solves with F2L focus
- **OLL weak** → OLL recognition drill, execution drill, full solves with OLL focus
- **PLL weak** → PLL recognition drill, execution drill, full solves with PLL focus

The algorithm scores each phase by combining its share of total solve time (60% weight) with its coefficient of variation / inconsistency (40% weight), then targets the highest-scoring phase.

### Data Management
- **Export JSON** / **Export CSV**: Download all solve data
- **Clear All Data**: Wipe everything (with confirmation)

## Tech Stack
- React + TypeScript + Vite
- No backend — all data in localStorage
- Scrambles via [cubing.js](https://js.cubing.net/) (loaded dynamically from CDN, with fallback random moves)
