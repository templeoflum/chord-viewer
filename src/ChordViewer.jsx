import { useState, useMemo } from "react";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const CHORD_TYPES = {
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

const INTERVAL_NAMES = {
  0: "R", 1: "\u266d2", 2: "2", 3: "\u266d3", 4: "3", 5: "4",
  6: "\u266d5", 7: "5", 8: "\u266f5", 9: "6", 10: "\u266d7", 11: "7",
  12: "8", 13: "\u266d9", 14: "9", 15: "\u266f9", 16: "10", 17: "11",
  18: "\u266f11", 19: "12", 20: "\u266d13", 21: "13",
};

const isBlackNote = (n) => [1, 3, 6, 8, 10].includes(n % 12);

const CATEGORIES = {
  "Triads": ["Major", "Minor", "Dim", "Aug", "Sus2", "Sus4", "Power"],
  "7ths": ["Maj7", "Min7", "Dom7", "Dim7", "Half-Dim7", "MinMaj7", "Aug7", "AugMaj7"],
  "Extended": ["6th", "Min6", "Add9", "Maj9", "Min9", "Dom9", "Maj11", "Min11", "Maj13"],
};

// Fixed keyboard: 37 semitones = C3 to C6 (three full octaves, always the same layout)
// That gives us 22 white keys (C D E F G A B x3 + final C)
const TOTAL_KEYS = 37;
const WHITE_COUNT = 22;

export default function ChordViewer() {
  const [root, setRoot] = useState(0); // 0=C, stored as pitch class
  const [chordType, setChordType] = useState("Maj7");

  const intervals = CHORD_TYPES[chordType];

  // Build set of active absolute semitone positions on the fixed keyboard
  // The keyboard always starts at C (semitone 0). Root note maps to its position.
  // We place the chord starting from the lowest occurrence of the root on the keyboard.
  const activeKeys = useMemo(() => {
    const map = new Map(); // absolute semitone position on keyboard -> interval label

    // Find the first occurrence of root on the keyboard (which starts at C=0)
    // root is 0-11 pitch class, keyboard positions are 0-24
    const firstRoot = root; // root pitch class IS the first position since keyboard starts at C

    for (const iv of intervals) {
      const pos = firstRoot + iv;
      if (pos >= 0 && pos < TOTAL_KEYS) {
        map.set(pos, INTERVAL_NAMES[iv]);
      }
    }

    // If some notes fell off the top, also try starting from root in first octave
    // (they should fit in two octaves for all our chord types)
    return map;
  }, [root, intervals]);

  // Fixed piano layout - always the same geometry
  const pianoData = useMemo(() => {
    const whites = [];
    const blacks = [];
    const whiteW = 100 / WHITE_COUNT;
    let wIdx = 0;

    // First pass: white keys
    for (let i = 0; i < TOTAL_KEYS; i++) {
      const noteInOctave = i % 12;
      if (!isBlackNote(noteInOctave)) {
        const isActive = activeKeys.has(i);
        const interval = activeKeys.get(i) || null;
        const isRoot = interval === "R";
        whites.push({
          pos: i, noteInOctave, noteName: NOTES[noteInOctave],
          isActive, isRoot, interval,
          x: wIdx * whiteW, w: whiteW,
        });
        wIdx++;
      }
    }

    // Second pass: black keys
    wIdx = 0;
    for (let i = 0; i < TOTAL_KEYS; i++) {
      const noteInOctave = i % 12;
      if (isBlackNote(noteInOctave)) {
        const isActive = activeKeys.has(i);
        const interval = activeKeys.get(i) || null;
        const isRoot = interval === "R";
        blacks.push({
          pos: i, noteInOctave, noteName: NOTES[noteInOctave],
          isActive, isRoot, interval,
          x: wIdx * whiteW - whiteW * 0.3, w: whiteW * 0.6,
        });
      } else {
        wIdx++;
      }
    }

    return { whites, blacks };
  }, [activeKeys]);

  const chordName = NOTES[root] + (
    chordType === "Major" ? "" :
    chordType === "Minor" ? "m" :
    chordType === "Dom7" ? "7" : chordType
  );
  const spelledOut = intervals.map(i => NOTES[(root + i) % 12]).join(" \u2013 ");

  const chordNotesMod12 = useMemo(() => [...new Set(intervals.map(i => (root + i) % 12))], [root, intervals]);
  const chordNotesSet = new Set(chordNotesMod12);

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", color: "#e0e0e0",
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          {chordName}
        </div>
        <div style={{ fontSize: "15px", color: "#888", letterSpacing: "3px" }}>{spelledOut}</div>
        <div style={{ fontSize: "12px", color: "#555", marginTop: "4px", letterSpacing: "1px" }}>
          {intervals.map(i => INTERVAL_NAMES[i]).join("  ")}
        </div>
      </div>

      {/* Fixed three-octave piano */}
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <svg viewBox="0 0 100 36" style={{ width: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
          {/* White keys first (behind) */}
          {pianoData.whites.map((k) => (
            <g key={"w" + k.pos} onClick={() => setRoot(k.noteInOctave)} style={{ cursor: "pointer" }}>
              <rect x={k.x + 0.15} y={0} width={k.w - 0.3} height={34} rx={0.6}
                fill={k.isRoot ? "#c084fc" : k.isActive ? "#7c3aed" : "#151520"}
                stroke={k.isActive ? "#a78bfa" : "#252535"} strokeWidth={0.2} />
              {k.isActive && k.interval && (
                <text x={k.x + k.w / 2} y={27.5} textAnchor="middle" fontSize="1.8" fontWeight="700"
                  fill={k.isRoot ? "#0a0a0f" : "#e0e0e0"}>{k.interval}</text>
              )}
              <text x={k.x + k.w / 2} y={32} textAnchor="middle" fontSize="1.2"
                fill={k.isActive ? (k.isRoot ? "#0a0a0f" : "#a78bfa") : "#3a3a4a"}>{k.noteName}</text>
            </g>
          ))}
          {/* Black keys on top */}
          {pianoData.blacks.map((k) => (
            <g key={"b" + k.pos} onClick={() => setRoot(k.noteInOctave)} style={{ cursor: "pointer" }}>
              <rect x={k.x + 0.1} y={0} width={k.w - 0.2} height={21} rx={0.5}
                fill={k.isRoot ? "#c084fc" : k.isActive ? "#7c3aed" : "#08080d"}
                stroke={k.isActive ? "#a78bfa" : "#181825"} strokeWidth={0.2} />
              {k.isActive && k.interval && (
                <text x={k.x + k.w / 2} y={17} textAnchor="middle" fontSize="1.5" fontWeight="700"
                  fill={k.isRoot ? "#0a0a0f" : "#e0e0e0"}>{k.interval}</text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Root selector */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "520px" }}>
        {NOTES.map((note, i) => (
          <button key={note} onClick={() => setRoot(i)} style={{
            padding: "8px 14px", fontSize: "14px", fontWeight: root === i ? 700 : 400,
            background: root === i ? "#c084fc" : isBlackNote(i) ? "#0d0d14" : "#151520",
            color: root === i ? "#0a0a0f" : isBlackNote(i) ? "#777" : "#bbb",
            border: "1px solid " + (root === i ? "#c084fc" : "#252535"),
            borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", minWidth: "42px", transition: "all 0.15s",
          }}>{note}</button>
        ))}
      </div>

      {/* Chord type selector */}
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {Object.entries(CATEGORIES).map(([cat, types]) => (
          <div key={cat}>
            <div style={{ fontSize: "11px", color: "#444", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>{cat}</div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {types.map(t => (
                <button key={t} onClick={() => setChordType(t)} style={{
                  padding: "6px 12px", fontSize: "13px", fontWeight: chordType === t ? 700 : 400,
                  background: chordType === t ? "#7c3aed" : "#0d0d14",
                  color: chordType === t ? "#fff" : "#888",
                  border: "1px solid " + (chordType === t ? "#7c3aed" : "#1e1e2e"),
                  borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{t}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Chromatic circle */}
      <div style={{ marginTop: "4px" }}>
        <svg width="200" height="200" viewBox="-105 -105 210 210">
          <circle cx={0} cy={0} r={88} fill="none" stroke="#1a1a24" strokeWidth={0.8} />
          {chordNotesMod12.length > 1 && (
            <polygon
              points={chordNotesMod12.map(n => {
                const s = (n - root + 12) % 12;
                const a = (s * 30 - 90) * Math.PI / 180;
                return Math.cos(a) * 88 + "," + Math.sin(a) * 88;
              }).join(" ")}
              fill="#7c3aed" fillOpacity={0.08} stroke="#a78bfa" strokeWidth={0.8} strokeOpacity={0.4} />
          )}
          {NOTES.map((_, i) => {
            const a = (i * 30 - 90) * Math.PI / 180;
            const x = Math.cos(a) * 88, y = Math.sin(a) * 88;
            const actual = (root + i) % 12;
            const active = chordNotesSet.has(actual);
            const isR = i === 0;
            return (
              <g key={i} onClick={() => setRoot(actual)} style={{ cursor: "pointer" }}>
                {active && <circle cx={x} cy={y} r={12} fill={isR ? "#c084fc" : "#7c3aed"} opacity={0.9} />}
                <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
                  fontSize={active ? "10" : "8"} fontWeight={active ? "700" : "400"}
                  fill={active ? (isR ? "#0a0a0f" : "#fff") : "#444"}
                  fontFamily="'JetBrains Mono', monospace">{NOTES[actual]}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ fontSize: "11px", color: "#2a2a3a", letterSpacing: "1px" }}>click any key or note to set root</div>
    </div>
  );
}
