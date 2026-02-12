# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm install` — install dependencies
- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally

No test runner or linter is configured.

## Architecture

This is a single-page React app (React 18, Vite 6, no TypeScript) for visualizing music chords on a piano keyboard and chromatic circle.

The entire app lives in one component: `src/ChordViewer.jsx`. There are no additional components, routing, state management libraries, or API calls.

**Key data structures in ChordViewer.jsx:**
- `CHORD_TYPES` — maps 24 chord names to arrays of semitone intervals from root (e.g. `"Maj7": [0, 4, 7, 11]`)
- `CATEGORIES` — groups chord type names into "Triads", "7ths", "Extended" for the UI selector
- `INTERVAL_NAMES` — maps semitone offsets (0–21) to display labels (R, ♭3, 5, etc.)
- `NOTES` — chromatic scale `["C", "C#", ..., "B"]`

**State:** Two pieces — `root` (0–11 pitch class) and `chordType` (string key into `CHORD_TYPES`).

**Rendering:** All visuals are inline SVG (piano keyboard + chromatic circle) with inline styles — no CSS files or CSS-in-JS libraries. The piano is a fixed two-octave layout (C to C, 25 semitones). Clicking any piano key, root button, or chromatic circle note sets the root.

**Deploy:** Static build to `dist/`, configured with `base: './'` for relative paths (GitHub Pages compatible).
