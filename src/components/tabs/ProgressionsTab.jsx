import { useState, useMemo } from "react";
import {
  NOTES, isBlackNote, COLORS, COMMON_PROGRESSIONS, resolveProgression,
  CHORD_TYPES, INTERVAL_NAMES, TOTAL_KEYS,
} from "../../utils/musicConstants.js";
import PianoKeyboard from "../shared/PianoKeyboard.jsx";
import ChromaticCircle from "../shared/ChromaticCircle.jsx";

const PROGRESSION_GENRES = [...new Set(COMMON_PROGRESSIONS.map(p => p.genre))];

export default function ProgressionsTab() {
  const [root, setRoot] = useState(0);
  const [selectedProg, setSelectedProg] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const prog = COMMON_PROGRESSIONS[selectedProg];
  const resolved = useMemo(() => resolveProgression(root, prog.numerals), [root, prog]);

  const currentChord = resolved[currentStep];

  const activeKeys = useMemo(() => {
    const map = new Map();
    if (!currentChord || !currentChord.intervals) return map;
    const chordRoot = currentChord.root !== undefined ? currentChord.root : root;
    for (const iv of currentChord.intervals) {
      const pos = chordRoot + iv;
      if (pos >= 0 && pos < TOTAL_KEYS) {
        map.set(pos, INTERVAL_NAMES[iv]);
      }
    }
    return map;
  }, [currentChord, root]);

  const chordNotesMod12 = useMemo(() => {
    if (!currentChord || !currentChord.intervals) return [];
    const chordRoot = currentChord.root !== undefined ? currentChord.root : root;
    return [...new Set(currentChord.intervals.map(i => (chordRoot + i) % 12))];
  }, [currentChord, root]);

  const handlePrev = () => setCurrentStep(s => (s - 1 + resolved.length) % resolved.length);
  const handleNext = () => setCurrentStep(s => (s + 1) % resolved.length);

  return (
    <>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          {prog.name}
        </div>
        <div style={{ fontSize: "14px", color: COLORS.muted }}>
          in {NOTES[root]} &middot; {prog.genre}
        </div>
      </div>

      {/* Numeral display with step highlighting */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", maxWidth: "720px" }}>
        {resolved.map((step, i) => (
          <div key={i} onClick={() => setCurrentStep(i)} style={{
            padding: "10px 16px", fontSize: "16px", fontWeight: i === currentStep ? 800 : 500,
            background: i === currentStep ? COLORS.accent : COLORS.surfaceDark,
            color: i === currentStep ? "#fff" : COLORS.text,
            border: "2px solid " + (i === currentStep ? COLORS.accentBright : COLORS.borderDark),
            borderRadius: "8px", cursor: "pointer", textAlign: "center",
            minWidth: "60px", transition: "all 0.15s",
          }}>
            <div style={{ fontSize: "12px", color: i === currentStep ? "rgba(255,255,255,0.7)" : COLORS.dim, marginBottom: "2px" }}>
              {step.numeral}
            </div>
            <div>{step.chordName}</div>
          </div>
        ))}
      </div>

      {/* Step controls */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={handlePrev} style={{
          padding: "8px 20px", fontSize: "14px", fontWeight: 600,
          background: COLORS.surfaceDark, color: COLORS.text,
          border: "1px solid " + COLORS.border, borderRadius: "6px",
          cursor: "pointer", fontFamily: "inherit",
        }}>&larr; Prev</button>
        <span style={{ fontSize: "14px", color: COLORS.muted }}>
          Step {currentStep + 1} of {resolved.length}
        </span>
        <button onClick={handleNext} style={{
          padding: "8px 20px", fontSize: "14px", fontWeight: 600,
          background: COLORS.surfaceDark, color: COLORS.text,
          border: "1px solid " + COLORS.border, borderRadius: "6px",
          cursor: "pointer", fontFamily: "inherit",
        }}>Next &rarr;</button>
      </div>

      <PianoKeyboard activeKeys={activeKeys} onKeyClick={setRoot} />

      {/* Root selector */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "520px" }}>
        {NOTES.map((note, i) => (
          <button key={note} onClick={() => { setRoot(i); setCurrentStep(0); }} style={{
            padding: "8px 14px", fontSize: "14px", fontWeight: root === i ? 700 : 400,
            background: root === i ? COLORS.accentBright : isBlackNote(i) ? COLORS.surfaceDark : COLORS.surface,
            color: root === i ? COLORS.bg : isBlackNote(i) ? "#777" : "#bbb",
            border: "1px solid " + (root === i ? COLORS.accentBright : COLORS.border),
            borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", minWidth: "42px", transition: "all 0.15s",
          }}>{note}</button>
        ))}
      </div>

      {/* Progression selector by genre */}
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {PROGRESSION_GENRES.map(genre => (
          <div key={genre}>
            <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>{genre}</div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {COMMON_PROGRESSIONS.map((p, i) => p.genre === genre && (
                <button key={i} onClick={() => { setSelectedProg(i); setCurrentStep(0); }} style={{
                  padding: "6px 12px", fontSize: "13px", fontWeight: selectedProg === i ? 700 : 400,
                  background: selectedProg === i ? COLORS.accent : COLORS.surfaceDark,
                  color: selectedProg === i ? "#fff" : COLORS.muted,
                  border: "1px solid " + (selectedProg === i ? COLORS.accent : COLORS.borderDark),
                  borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{p.name}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ChromaticCircle root={root} activeNotes={chordNotesMod12} onNoteClick={setRoot} />
    </>
  );
}
