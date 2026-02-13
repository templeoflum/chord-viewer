# Chord Viewer

Music theory toolkit — explore chords, scales, progressions, grooves, and more on an interactive three-octave keyboard and chromatic circle.

**[Try it live](https://templeoflum.github.io/chord-viewer/)**

## Features

### Theory
- **Chords** — 24 chord types (triads, 7ths, extended) with inversions and transposition
- **Scales** — 14 scale types with interactive diatonic chords and mode relationship info
- **Circle of 5ths** — Interactive circle with key signatures, neighbor keys, and diatonic chords
- **Progressions** — 10 common progressions (Pop, Jazz, Blues, Rock) with step-through playback

### Rhythm
- **Grooves** — 14 drum patterns (Electronic, Hip-Hop, Latin, Rock) on a 16-step grid
- **Time Signatures** — 9 time signatures with beat visualization and accent patterns

### Reference
- **Tempo** — BPM calculator with note/subdivision timing
- **Frequencies** — Full MIDI-to-frequency reference table
- **Intervals** — Interval identification and builder with ratios and cents

### Shared
- Three-octave piano keyboard with dual-layer highlighting
- Chromatic circle showing note geometry
- Click any key or note to change root
- Dark theme, all inline styles, no external dependencies

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run build
```

Push the `dist/` folder, or use GitHub Actions for auto-deploy.
