import { useState, useMemo } from "react";
import {
  NOTES, isBlackNote, INTERVAL_NAMES, CHORD_TYPES, CHORD_CATEGORIES, COLORS, TOTAL_KEYS,
  getInversion,
} from "../../utils/musicConstants.js";
import PianoKeyboard from "../shared/PianoKeyboard.jsx";
import ChromaticCircle from "../shared/ChromaticCircle.jsx";

const INVERSION_LABELS = ["Root position", "1st inversion", "2nd inversion", "3rd inversion", "4th inversion", "5th inversion"];

export default function ChordsTab() {
  const [root, setRoot] = useState(0);
  const [chordType, setChordType] = useState("Maj7");
  const [transposeSemitones, setTransposeSemitones] = useState(0);
  const [inversion, setInversion] = useState(0);

  const baseIntervals = CHORD_TYPES[chordType];
  const maxInversion = baseIntervals.length - 1;
  const clampedInversion = Math.min(inversion, maxInversion);
  const intervals = useMemo(
    () => clampedInversion > 0 ? getInversion(baseIntervals, clampedInversion) : baseIntervals,
    [baseIntervals, clampedInversion]
  );

  // Reset inversion if chord type changes and inversion is out of range
  const effectiveInversion = clampedInversion;

  const activeKeys = useMemo(() => {
    const map = new Map();
    for (const iv of intervals) {
      const pos = root + iv;
      if (pos >= 0 && pos < TOTAL_KEYS) {
        map.set(pos, INTERVAL_NAMES[iv] || INTERVAL_NAMES[iv % 12] || "");
      }
    }
    return map;
  }, [root, intervals]);

  const chordName = NOTES[root] + (
    chordType === "Major" ? "" :
    chordType === "Minor" ? "m" :
    chordType === "Dom7" ? "7" : chordType
  );
  const spelledOut = intervals.map(i => NOTES[(root + i) % 12]).join(" \u2013 ");
  const chordNotesMod12 = useMemo(() => [...new Set(intervals.map(i => (root + i) % 12))], [root, intervals]);

  const transposedRoot = ((root + transposeSemitones) % 12 + 12) % 12;
  const transposedChordSuffix = (
    chordType === "Major" ? "" :
    chordType === "Minor" ? "m" :
    chordType === "Dom7" ? "7" : chordType
  );
  const transposedChordName = NOTES[transposedRoot] + transposedChordSuffix;
  const transposedSpelling = baseIntervals.map(i => NOTES[(transposedRoot + i) % 12]).join(" \u2013 ");
  const transposeSign = transposeSemitones > 0 ? "+" : "";

  return (
    <>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          {chordName}
        </div>
        <div style={{ fontSize: "15px", color: COLORS.muted, letterSpacing: "3px" }}>{spelledOut}</div>
        <div style={{ fontSize: "12px", color: COLORS.dim, marginTop: "4px", letterSpacing: "1px" }}>
          {intervals.map(i => INTERVAL_NAMES[i] || INTERVAL_NAMES[i % 12] || "").join("  ")}
        </div>
        {effectiveInversion > 0 && (
          <div style={{ fontSize: "12px", color: COLORS.accentLight, marginTop: "4px" }}>
            {INVERSION_LABELS[effectiveInversion]}
          </div>
        )}
      </div>

      {/* Inversion buttons */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
        {Array.from({ length: maxInversion + 1 }, (_, i) => (
          <button key={i} onClick={() => setInversion(i)} style={{
            padding: "5px 12px", fontSize: "12px", fontWeight: effectiveInversion === i ? 700 : 400,
            background: effectiveInversion === i ? COLORS.accent : COLORS.surfaceDark,
            color: effectiveInversion === i ? "#fff" : COLORS.muted,
            border: "1px solid " + (effectiveInversion === i ? COLORS.accent : COLORS.borderDark),
            borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}>{i === 0 ? "Root" : INVERSION_LABELS[i]}</button>
        ))}
      </div>

      <PianoKeyboard activeKeys={activeKeys} onKeyClick={setRoot} />

      {/* Root selector */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "520px" }}>
        {NOTES.map((note, i) => (
          <button key={note} onClick={() => setRoot(i)} style={{
            padding: "8px 14px", fontSize: "14px", fontWeight: root === i ? 700 : 400,
            background: root === i ? COLORS.accentBright : isBlackNote(i) ? COLORS.surfaceDark : COLORS.surface,
            color: root === i ? COLORS.bg : isBlackNote(i) ? "#777" : "#bbb",
            border: "1px solid " + (root === i ? COLORS.accentBright : COLORS.border),
            borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", minWidth: "42px", transition: "all 0.15s",
          }}>{note}</button>
        ))}
      </div>

      {/* Chord type selector */}
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {Object.entries(CHORD_CATEGORIES).map(([cat, types]) => (
          <div key={cat}>
            <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>{cat}</div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {types.map(t => (
                <button key={t} onClick={() => { setChordType(t); setInversion(0); }} style={{
                  padding: "6px 12px", fontSize: "13px", fontWeight: chordType === t ? 700 : 400,
                  background: chordType === t ? COLORS.accent : COLORS.surfaceDark,
                  color: chordType === t ? "#fff" : COLORS.muted,
                  border: "1px solid " + (chordType === t ? COLORS.accent : COLORS.borderDark),
                  borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{t}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ChromaticCircle root={root} activeNotes={chordNotesMod12} onNoteClick={setRoot} />

      <div style={{ fontSize: "11px", color: COLORS.faintest, letterSpacing: "1px" }}>click any key or note to set root</div>

      {/* Transpose */}
      <div style={{
        width: "100%", maxWidth: "600px", padding: "20px",
        background: COLORS.surfaceDark, borderRadius: "12px",
        border: "1px solid " + COLORS.borderDark,
        display: "flex", flexDirection: "column", gap: "12px", alignItems: "center",
      }}>
        <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase" }}>
          Transpose
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}>
          <input type="range" min={-11} max={11} value={transposeSemitones}
            onChange={e => setTransposeSemitones(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: COLORS.accent }} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: COLORS.accentBright, minWidth: "80px", textAlign: "center" }}>
            {transposeSign}{transposeSemitones} semi
          </span>
        </div>
        {transposeSemitones !== 0 && (
          <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: COLORS.dim }}>{chordName}</div>
              <div style={{ fontSize: "11px", color: COLORS.dimmer, marginTop: "2px" }}>{spelledOut}</div>
            </div>
            <div style={{ fontSize: "18px", color: COLORS.dim }}>&rarr;</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: COLORS.accentBright }}>{transposedChordName}</div>
              <div style={{ fontSize: "11px", color: COLORS.muted, marginTop: "2px" }}>{transposedSpelling}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
