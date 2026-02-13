import { useState, useMemo } from "react";
import {
  NOTES, isBlackNote, SCALE_TYPES, SCALE_DEGREE_LABELS, COLORS, TOTAL_KEYS,
  getDiatonicChords, CHORD_TYPES, INTERVAL_NAMES, getParentScale,
} from "../../utils/musicConstants.js";
import PianoKeyboard from "../shared/PianoKeyboard.jsx";
import ChromaticCircle from "../shared/ChromaticCircle.jsx";

const SCALE_CATEGORIES = {
  "Common": ["Major", "Natural Minor", "Harmonic Minor", "Melodic Minor"],
  "Modes": ["Dorian", "Phrygian", "Lydian", "Mixolydian", "Locrian"],
  "Other": ["Pentatonic Major", "Pentatonic Minor", "Blues", "Whole Tone", "Chromatic"],
};

const DIATONIC_CHORD_QUALITIES = {
  "Major":          ["Major", "Minor", "Minor", "Major", "Major", "Minor", "Dim"],
  "Natural Minor":  ["Minor", "Dim", "Major", "Minor", "Minor", "Major", "Major"],
  "Harmonic Minor": ["Minor", "Dim", "Aug", "Minor", "Major", "Major", "Dim"],
  "Melodic Minor":  ["Minor", "Minor", "Aug", "Major", "Major", "Dim", "Dim"],
  "Dorian":         ["Minor", "Minor", "Major", "Major", "Minor", "Dim", "Major"],
  "Phrygian":       ["Minor", "Major", "Major", "Minor", "Dim", "Major", "Minor"],
  "Lydian":         ["Major", "Major", "Minor", "Dim", "Major", "Minor", "Minor"],
  "Mixolydian":     ["Major", "Minor", "Dim", "Major", "Minor", "Minor", "Major"],
  "Locrian":        ["Dim", "Major", "Minor", "Minor", "Major", "Major", "Minor"],
};

export default function ScalesTab() {
  const [root, setRoot] = useState(0);
  const [scaleType, setScaleType] = useState("Major");
  const [selectedDiatonic, setSelectedDiatonic] = useState(null);

  const intervals = SCALE_TYPES[scaleType];

  // Scale notes as dim keys (background layer)
  const scaleKeys = useMemo(() => {
    const map = new Map();
    for (let octaveOffset = 0; octaveOffset < TOTAL_KEYS; octaveOffset += 12) {
      intervals.forEach((iv, idx) => {
        const pos = root + octaveOffset + iv;
        if (pos >= 0 && pos < TOTAL_KEYS) {
          const label = idx < SCALE_DEGREE_LABELS.length ? SCALE_DEGREE_LABELS[idx] : (idx + 1).toString();
          map.set(pos, label);
        }
      });
    }
    return map;
  }, [root, intervals]);

  const scaleNotesMod12 = useMemo(
    () => [...new Set(intervals.map(i => (root + i) % 12))],
    [root, intervals]
  );

  const diatonicChords = useMemo(() => getDiatonicChords(root, scaleType), [root, scaleType]);

  // Compute chord overlay when a diatonic chord is selected
  const chordOverlay = useMemo(() => {
    if (selectedDiatonic === null || !diatonicChords) return null;
    const qualities = DIATONIC_CHORD_QUALITIES[scaleType];
    if (!qualities) return null;
    const chordRoot = (root + intervals[selectedDiatonic]) % 12;
    const quality = qualities[selectedDiatonic];
    const chordIntervals = CHORD_TYPES[quality];
    if (!chordIntervals) return null;

    // Build active keys for chord
    const activeMap = new Map();
    for (let octaveOffset = 0; octaveOffset < TOTAL_KEYS; octaveOffset += 12) {
      for (const iv of chordIntervals) {
        const pos = chordRoot + octaveOffset + iv;
        if (pos >= 0 && pos < TOTAL_KEYS) {
          activeMap.set(pos, INTERVAL_NAMES[iv]);
        }
      }
    }

    const notesMod12 = [...new Set(chordIntervals.map(i => (chordRoot + i) % 12))];
    return { activeKeys: activeMap, notesMod12, chordRoot };
  }, [selectedDiatonic, diatonicChords, root, intervals, scaleType]);

  const parentInfo = useMemo(() => getParentScale(root, scaleType), [root, scaleType]);

  const scaleName = NOTES[root] + " " + scaleType;
  const spelledOut = intervals.map(i => NOTES[(root + i) % 12]).join(" \u2013 ");

  // Determine what to show on keyboard/circle
  const showActiveKeys = chordOverlay ? chordOverlay.activeKeys : scaleKeys;
  const showDimKeys = chordOverlay ? scaleKeys : undefined;
  const showActiveNotes = chordOverlay ? chordOverlay.notesMod12 : scaleNotesMod12;
  const showDimNotes = chordOverlay ? scaleNotesMod12 : undefined;

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          {scaleName}
        </div>
        <div style={{ fontSize: "15px", color: COLORS.muted, letterSpacing: "3px" }}>{spelledOut}</div>
        {parentInfo && (
          <div style={{ fontSize: "12px", color: COLORS.accentLight, marginTop: "6px" }}>
            {NOTES[root]} {scaleType} = {parentInfo.parentName} starting on {parentInfo.degree === 2 ? "2nd" : parentInfo.degree === 3 ? "3rd" : parentInfo.degree + "th"} degree
          </div>
        )}
      </div>

      <PianoKeyboard activeKeys={showActiveKeys} dimKeys={showDimKeys} onKeyClick={setRoot} />

      {/* Root selector */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", maxWidth: "520px" }}>
        {NOTES.map((note, i) => (
          <button key={note} onClick={() => { setRoot(i); setSelectedDiatonic(null); }} style={{
            padding: "8px 14px", fontSize: "14px", fontWeight: root === i ? 700 : 400,
            background: root === i ? COLORS.accentBright : isBlackNote(i) ? COLORS.surfaceDark : COLORS.surface,
            color: root === i ? COLORS.bg : isBlackNote(i) ? "#777" : "#bbb",
            border: "1px solid " + (root === i ? COLORS.accentBright : COLORS.border),
            borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", minWidth: "42px", transition: "all 0.15s",
          }}>{note}</button>
        ))}
      </div>

      {/* Scale type selector */}
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {Object.entries(SCALE_CATEGORIES).map(([cat, types]) => (
          <div key={cat}>
            <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>{cat}</div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {types.map(t => (
                <button key={t} onClick={() => { setScaleType(t); setSelectedDiatonic(null); }} style={{
                  padding: "6px 12px", fontSize: "13px", fontWeight: scaleType === t ? 700 : 400,
                  background: scaleType === t ? COLORS.accent : COLORS.surfaceDark,
                  color: scaleType === t ? "#fff" : COLORS.muted,
                  border: "1px solid " + (scaleType === t ? COLORS.accent : COLORS.borderDark),
                  borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{t}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ChromaticCircle root={root} activeNotes={showActiveNotes} dimNotes={showDimNotes} onNoteClick={setRoot} />

      {/* Diatonic chords */}
      {diatonicChords && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            Diatonic Chords {selectedDiatonic !== null && <span style={{ color: COLORS.accentLight }}>(click again to deselect)</span>}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {diatonicChords.map((chord, i) => {
              const isSelected = selectedDiatonic === i;
              return (
                <div key={i} onClick={() => setSelectedDiatonic(isSelected ? null : i)} style={{
                  padding: "8px 14px", fontSize: "15px", fontWeight: 600,
                  background: isSelected ? COLORS.accent : COLORS.surfaceDark,
                  color: isSelected ? "#fff" : COLORS.text,
                  border: "1px solid " + (isSelected ? COLORS.accentLight : COLORS.borderDark),
                  borderRadius: "6px", minWidth: "48px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div>{chord}</div>
                  <div style={{ fontSize: "10px", color: isSelected ? "rgba(255,255,255,0.7)" : COLORS.dim, marginTop: "2px" }}>
                    {["I", "II", "III", "IV", "V", "VI", "VII"][i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ fontSize: "11px", color: COLORS.faintest, letterSpacing: "1px" }}>click any key or note to set root</div>
    </>
  );
}
