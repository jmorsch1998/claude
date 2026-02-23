# Cube Timer

A web-based Rubik's cube timer with scramble generation, cube state visualization, and a persistent leaderboard.

**Live:** [jmorsch1998.github.io/claude](https://jmorsch1998.github.io/claude/)

## Features

- **Scramble Generator** — WCA-standard random-state 3x3 scrambles powered by [cubing.js](https://github.com/cubing/cubing.js)
- **Cube Visualization** — 2D net showing the cube state after the scramble
- **Stopwatch** — Hold spacebar to ready (red → green), release to start, tap to stop. Also supports tap-and-hold on mobile
- **Leaderboard** — Top 10 fastest times and last 10 recent solves, saved to localStorage
- **Save with Name & Date** — After each solve, save your time with your name

## Usage

1. Read the scramble and scramble your cube
2. Hold **spacebar** until the timer turns green
3. Release to start the timer
4. Tap **spacebar** to stop
5. Enter your name and save, or press **Escape** to discard

## Tech

Single HTML file, no build step. Uses [cubing.js](https://github.com/cubing/cubing.js) via ESM CDN for scramble generation and the `<twisty-player>` web component for visualization. Falls back to random-move scrambles if the CDN is unavailable.
