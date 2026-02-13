// ─── Core note data ──────────────────────────────────────────────────────────
export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const isBlackNote = (n) => [1, 3, 6, 8, 10].includes(n % 12);

// ─── Colors (consolidated from inline styles) ────────────────────────────────
export const COLORS = {
  bg: "#0a0a0f",
  text: "#e0e0e0",
  muted: "#888",
  dim: "#555",
  dimmer: "#444",
  faint: "#3a3a4a",
  faintest: "#2a2a3a",
  accent: "#7c3aed",
  accentLight: "#a78bfa",
  accentBright: "#c084fc",
  surface: "#151520",
  surfaceDark: "#0d0d14",
  border: "#252535",
  borderDark: "#1e1e2e",
  borderDim: "#1a1a24",
  keyBlack: "#08080d",
  keyBlackBorder: "#181825",
};

// ─── Piano layout ────────────────────────────────────────────────────────────
export const TOTAL_KEYS = 37;
export const WHITE_COUNT = 22;

// ─── Interval names (semitone offset → label) ────────────────────────────────
export const INTERVAL_NAMES = {
  0: "R", 1: "\u266d2", 2: "2", 3: "\u266d3", 4: "3", 5: "4",
  6: "\u266d5", 7: "5", 8: "\u266f5", 9: "6", 10: "\u266d7", 11: "7",
  12: "8", 13: "\u266d9", 14: "9", 15: "\u266f9", 16: "10", 17: "11",
  18: "\u266f11", 19: "12", 20: "\u266d13", 21: "13",
};

// Full interval names for the Intervals tab
export const INTERVAL_FULL_NAMES = [
  { semitones: 0, name: "Perfect Unison", short: "P1", ratio: "1:1", cents: 0 },
  { semitones: 1, name: "Minor 2nd", short: "m2", ratio: "16:15", cents: 100 },
  { semitones: 2, name: "Major 2nd", short: "M2", ratio: "9:8", cents: 200 },
  { semitones: 3, name: "Minor 3rd", short: "m3", ratio: "6:5", cents: 300 },
  { semitones: 4, name: "Major 3rd", short: "M3", ratio: "5:4", cents: 400 },
  { semitones: 5, name: "Perfect 4th", short: "P4", ratio: "4:3", cents: 500 },
  { semitones: 6, name: "Tritone", short: "TT", ratio: "45:32", cents: 600 },
  { semitones: 7, name: "Perfect 5th", short: "P5", ratio: "3:2", cents: 700 },
  { semitones: 8, name: "Minor 6th", short: "m6", ratio: "8:5", cents: 800 },
  { semitones: 9, name: "Major 6th", short: "M6", ratio: "5:3", cents: 900 },
  { semitones: 10, name: "Minor 7th", short: "m7", ratio: "9:5", cents: 1000 },
  { semitones: 11, name: "Major 7th", short: "M7", ratio: "15:8", cents: 1100 },
  { semitones: 12, name: "Perfect Octave", short: "P8", ratio: "2:1", cents: 1200 },
];

// ─── Chord types ─────────────────────────────────────────────────────────────
export const CHORD_TYPES = {
  "Major": [0, 4, 7],
  "Minor": [0, 3, 7],
  "Dim": [0, 3, 6],
  "Aug": [0, 4, 8],
  "Sus2": [0, 2, 7],
  "Sus4": [0, 5, 7],
  "Maj7": [0, 4, 7, 11],
  "Min7": [0, 3, 7, 10],
  "Dom7": [0, 4, 7, 10],
  "Dim7": [0, 3, 6, 9],
  "Half-Dim7": [0, 3, 6, 10],
  "MinMaj7": [0, 3, 7, 11],
  "Aug7": [0, 4, 8, 10],
  "AugMaj7": [0, 4, 8, 11],
  "Add9": [0, 4, 7, 14],
  "Maj9": [0, 4, 7, 11, 14],
  "Min9": [0, 3, 7, 10, 14],
  "Dom9": [0, 4, 7, 10, 14],
  "6th": [0, 4, 7, 9],
  "Min6": [0, 3, 7, 9],
  "Maj11": [0, 4, 7, 11, 14, 17],
  "Min11": [0, 3, 7, 10, 14, 17],
  "Maj13": [0, 4, 7, 11, 14, 21],
  "Power": [0, 7],
};

export const CHORD_CATEGORIES = {
  "Triads": ["Major", "Minor", "Dim", "Aug", "Sus2", "Sus4", "Power"],
  "7ths": ["Maj7", "Min7", "Dom7", "Dim7", "Half-Dim7", "MinMaj7", "Aug7", "AugMaj7"],
  "Extended": ["6th", "Min6", "Add9", "Maj9", "Min9", "Dom9", "Maj11", "Min11", "Maj13"],
};

// ─── Scale types ─────────────────────────────────────────────────────────────
export const SCALE_TYPES = {
  "Major": [0, 2, 4, 5, 7, 9, 11],
  "Natural Minor": [0, 2, 3, 5, 7, 8, 10],
  "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
  "Melodic Minor": [0, 2, 3, 5, 7, 9, 11],
  "Dorian": [0, 2, 3, 5, 7, 9, 10],
  "Phrygian": [0, 1, 3, 5, 7, 8, 10],
  "Lydian": [0, 2, 4, 6, 7, 9, 11],
  "Mixolydian": [0, 2, 4, 5, 7, 9, 10],
  "Locrian": [0, 1, 3, 5, 6, 8, 10],
  "Pentatonic Major": [0, 2, 4, 7, 9],
  "Pentatonic Minor": [0, 3, 5, 7, 10],
  "Blues": [0, 3, 5, 6, 7, 10],
  "Whole Tone": [0, 2, 4, 6, 8, 10],
  "Chromatic": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export const SCALE_DEGREE_LABELS = ["R", "2", "3", "4", "5", "6", "7"];

// Diatonic chord quality patterns for 7-note scales
const DIATONIC_CHORD_PATTERNS = {
  "Major":          ["", "m", "m", "", "", "m", "dim"],
  "Natural Minor":  ["m", "dim", "", "m", "m", "", ""],
  "Harmonic Minor": ["m", "dim", "Aug", "m", "", "", "dim"],
  "Melodic Minor":  ["m", "m", "Aug", "", "", "dim", "dim"],
  "Dorian":         ["m", "m", "", "", "m", "dim", ""],
  "Phrygian":       ["m", "", "", "m", "dim", "", "m"],
  "Lydian":         ["", "", "m", "dim", "", "m", "m"],
  "Mixolydian":     ["", "m", "dim", "", "m", "m", ""],
  "Locrian":        ["dim", "", "m", "m", "", "", "m"],
};

export function getDiatonicChords(root, scaleType) {
  const pattern = DIATONIC_CHORD_PATTERNS[scaleType];
  if (!pattern) return null;
  const intervals = SCALE_TYPES[scaleType];
  return intervals.map((iv, i) => {
    const noteName = NOTES[(root + iv) % 12];
    return noteName + pattern[i];
  });
}

// ─── Circle of Fifths ───────────────────────────────────────────────────────
export const CIRCLE_OF_FIFTHS = [
  { major: "C",  minor: "Am",  sharps: 0, flats: 0, sig: "" },
  { major: "G",  minor: "Em",  sharps: 1, flats: 0, sig: "F#" },
  { major: "D",  minor: "Bm",  sharps: 2, flats: 0, sig: "F# C#" },
  { major: "A",  minor: "F#m", sharps: 3, flats: 0, sig: "F# C# G#" },
  { major: "E",  minor: "C#m", sharps: 4, flats: 0, sig: "F# C# G# D#" },
  { major: "B",  minor: "G#m", sharps: 5, flats: 0, sig: "F# C# G# D# A#" },
  { major: "F#", minor: "D#m", sharps: 6, flats: 0, sig: "F# C# G# D# A# E#" },
  { major: "Db", minor: "Bbm", sharps: 0, flats: 5, sig: "Bb Eb Ab Db Gb" },
  { major: "Ab", minor: "Fm",  sharps: 0, flats: 4, sig: "Bb Eb Ab Db" },
  { major: "Eb", minor: "Cm",  sharps: 0, flats: 3, sig: "Bb Eb Ab" },
  { major: "Bb", minor: "Gm",  sharps: 0, flats: 2, sig: "Bb Eb" },
  { major: "F",  minor: "Dm",  sharps: 0, flats: 1, sig: "Bb" },
];

// ─── Common Progressions ───────────────────────────────────────────────────
export const COMMON_PROGRESSIONS = [
  { name: "Pop (Axis)", numerals: ["I","V","vi","IV"], genre: "Pop" },
  { name: "50s / Doo-wop", numerals: ["I","vi","IV","V"], genre: "Pop" },
  { name: "Canon", numerals: ["I","V","vi","iii","IV","I","IV","V"], genre: "Classical" },
  { name: "ii-V-I", numerals: ["ii","V","I"], genre: "Jazz" },
  { name: "Jazz Turnaround", numerals: ["I","vi","ii","V"], genre: "Jazz" },
  { name: "Andalusian Cadence", numerals: ["i","VII","VI","V"], genre: "Flamenco" },
  { name: "12-Bar Blues", numerals: ["I","I","I","I","IV","IV","I","I","V","IV","I","V"], genre: "Blues" },
  { name: "Minor Pop", numerals: ["i","VI","III","VII"], genre: "Pop" },
  { name: "Plagal", numerals: ["I","IV","I","IV"], genre: "Rock" },
  { name: "Grunge", numerals: ["I","bIII","bVII","I"], genre: "Rock" },
];

const NUMERAL_MAP = {
  "I":    { degree: 0, quality: "Major" },
  "ii":   { degree: 2, quality: "Minor" },
  "iii":  { degree: 4, quality: "Minor" },
  "IV":   { degree: 5, quality: "Major" },
  "V":    { degree: 7, quality: "Major" },
  "vi":   { degree: 9, quality: "Minor" },
  "vii":  { degree: 11, quality: "Dim" },
  "i":    { degree: 0, quality: "Minor" },
  "III":  { degree: 3, quality: "Major" },
  "VI":   { degree: 8, quality: "Major" },
  "VII":  { degree: 10, quality: "Major" },
  "bIII": { degree: 3, quality: "Major" },
  "bVII": { degree: 10, quality: "Major" },
  "iv":   { degree: 5, quality: "Minor" },
  "v":    { degree: 7, quality: "Minor" },
};

export function resolveProgression(root, numerals) {
  return numerals.map(num => {
    const entry = NUMERAL_MAP[num];
    if (!entry) return { numeral: num, chordName: num, intervals: [0, 4, 7] };
    const chordRoot = (root + entry.degree) % 12;
    const suffix = entry.quality === "Major" ? "" : entry.quality === "Minor" ? "m" : entry.quality;
    return {
      numeral: num,
      chordName: NOTES[chordRoot] + suffix,
      intervals: CHORD_TYPES[entry.quality],
      root: chordRoot,
    };
  });
}

// ─── Groove Patterns ────────────────────────────────────────────────────────
export const GROOVE_PATTERNS = {
  "Four on the Floor": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
  "Disco": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
  },
  "House": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
    snare: [0,0,0,0, 1,0,0,0.5, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
  "Drum & Bass": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
  },
  "Boom Bap": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
  "Trap": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,0, 1,0,0,1, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
  },
  "Lo-fi Hip Hop": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,0.5, 0,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0.5,0],
    hihat: [1,0,0.5,0, 1,0,0.5,0, 1,0,0.5,0, 1,0,0.5,0],
  },
  "Bossa Nova": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
    snare: [0,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
  "Reggaeton": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,1, 1,0,0,0, 0,0,0,1],
    snare: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
  "Samba": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,1,0,1, 1,0,1,1, 1,1,0,1, 1,0,1,1],
  },
  "Standard Rock": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,0, 1,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
  "Shuffle": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hihat: [1,0,0.5,1, 0,0.5,1,0, 0.5,1,0,0.5, 1,0,0.5,1],
  },
  "Half-Time": {
    timeSignature: "4/4", steps: 16,
    kick:  [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare: [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
  "Waltz": {
    timeSignature: "3/4", steps: 12,
    kick:  [1,0,0,0, 0,0,0,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 1,0,0,0],
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0],
  },
};

export const GROOVE_CATEGORIES = {
  "Electronic": ["Four on the Floor", "Disco", "House", "Drum & Bass"],
  "Hip-Hop": ["Boom Bap", "Trap", "Lo-fi Hip Hop"],
  "Latin/World": ["Bossa Nova", "Reggaeton", "Samba"],
  "Rock/Pop": ["Standard Rock", "Shuffle", "Half-Time", "Waltz"],
};

// ─── Time Signatures ────────────────────────────────────────────────────────
export const TIME_SIGNATURES = [
  { sig: "4/4", name: "Common Time", beats: 4, division: 4, accents: [3,1,2,1], grouping: "4", genres: "Most popular music" },
  { sig: "3/4", name: "Waltz", beats: 3, division: 4, accents: [3,1,1], grouping: "3", genres: "Waltz, classical, some ballads" },
  { sig: "2/4", name: "March / Polka", beats: 2, division: 4, accents: [3,1], grouping: "2", genres: "March, polka, some Latin" },
  { sig: "6/8", name: "Compound Duple", beats: 6, division: 8, accents: [3,1,1,2,1,1], grouping: "3+3", genres: "Irish jigs, some ballads, blues" },
  { sig: "5/4", name: "Irregular (Five)", beats: 5, division: 4, accents: [3,1,2,1,1], grouping: "3+2", genres: "Progressive rock, jazz (Take Five)" },
  { sig: "7/8", name: "Irregular (Seven)", beats: 7, division: 8, accents: [3,1,2,1,2,1,1], grouping: "2+2+3", genres: "Balkan folk, progressive rock" },
  { sig: "12/8", name: "Compound Quadruple", beats: 12, division: 8, accents: [3,1,1,2,1,1,2,1,1,2,1,1], grouping: "3+3+3+3", genres: "Blues, doo-wop, slow ballads" },
  { sig: "9/8", name: "Compound Triple", beats: 9, division: 8, accents: [3,1,1,2,1,1,2,1,1], grouping: "3+3+3", genres: "Some classical, jazz waltzes" },
  { sig: "5/8", name: "Short Five", beats: 5, division: 8, accents: [3,1,2,1,1], grouping: "2+3", genres: "Eastern European folk, progressive" },
];

// ─── Inversion helper ───────────────────────────────────────────────────────
export function getInversion(intervals, inversion) {
  const sorted = [...intervals];
  for (let i = 0; i < inversion; i++) {
    sorted.push(sorted.shift() + 12);
  }
  return sorted;
}

// ─── Mode relationship helpers ──────────────────────────────────────────────
export const MODE_PARENT_SCALES = {
  "Dorian": { parent: "Major", degree: 2 },
  "Phrygian": { parent: "Major", degree: 3 },
  "Lydian": { parent: "Major", degree: 4 },
  "Mixolydian": { parent: "Major", degree: 5 },
  "Locrian": { parent: "Major", degree: 7 },
  "Natural Minor": { parent: "Major", degree: 6 },
};

export function getParentScale(root, scaleType) {
  const info = MODE_PARENT_SCALES[scaleType];
  if (!info) return null;
  const parentIntervals = SCALE_TYPES[info.parent];
  // The parent root is: go back (degree-1) steps in the parent scale
  // If this scale's root is degree N of the parent, the parent root = root - parentIntervals[degree-1]
  const offset = parentIntervals[info.degree - 1];
  const parentRoot = ((root - offset) % 12 + 12) % 12;
  return { parentRoot, parentName: NOTES[parentRoot] + " " + info.parent, degree: info.degree };
}

// ─── Frequency helpers ───────────────────────────────────────────────────────
export function calculateFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function generateFrequencyTable() {
  const rows = [];
  for (let midi = 12; midi <= 119; midi++) {
    const noteIndex = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    rows.push({
      note: NOTES[noteIndex],
      octave,
      frequency: calculateFrequency(midi),
      midi,
      isBlack: isBlackNote(noteIndex),
    });
  }
  return rows;
}

// ─── Transposer helpers ──────────────────────────────────────────────────────
const CHORD_REGEX = /([A-G][#b]?)([^A-G\s]*)/g;

const NOTE_TO_INDEX = {};
NOTES.forEach((n, i) => { NOTE_TO_INDEX[n] = i; });
NOTE_TO_INDEX["Db"] = 1;
NOTE_TO_INDEX["Eb"] = 3;
NOTE_TO_INDEX["Gb"] = 6;
NOTE_TO_INDEX["Ab"] = 8;
NOTE_TO_INDEX["Bb"] = 10;

export function transposeChord(chord, semitones) {
  const match = chord.match(/^([A-G][#b]?)(.*)/);
  if (!match) return chord;
  const [, rootStr, suffix] = match;
  const idx = NOTE_TO_INDEX[rootStr];
  if (idx === undefined) return chord;
  const newIdx = ((idx + semitones) % 12 + 12) % 12;
  return NOTES[newIdx] + suffix;
}

export function transposeProgression(text, semitones) {
  return text.replace(CHORD_REGEX, (match, root, suffix) => {
    const idx = NOTE_TO_INDEX[root];
    if (idx === undefined) return match;
    const newIdx = ((idx + semitones) % 12 + 12) % 12;
    return NOTES[newIdx] + suffix;
  });
}
