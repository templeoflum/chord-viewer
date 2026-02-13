import { useState, useMemo } from "react";
import { NOTES, isBlackNote, INTERVAL_FULL_NAMES, COLORS } from "../../utils/musicConstants.js";

export default function IntervalsTab() {
  const [mode, setMode] = useState("identify"); // "identify" or "build"
  const [note1, setNote1] = useState(0);
  const [note2, setNote2] = useState(7);
  const [selectedInterval, setSelectedInterval] = useState(7);

  // Identify mode: two notes → interval
  const identified = useMemo(() => {
    const semitones = ((note2 - note1) % 12 + 12) % 12;
    return INTERVAL_FULL_NAMES.find(iv => iv.semitones === semitones) || INTERVAL_FULL_NAMES[0];
  }, [note1, note2]);

  // Build mode: note + interval → target
  const targetNote = useMemo(() => {
    return (note1 + selectedInterval) % 12;
  }, [note1, selectedInterval]);

  const NoteSelector = ({ value, onChange, label }) => (
    <div>
      <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
        {NOTES.map((note, i) => (
          <button key={note} onClick={() => onChange(i)} style={{
            padding: "8px 12px", fontSize: "14px", fontWeight: value === i ? 700 : 400,
            background: value === i ? COLORS.accentBright : isBlackNote(i) ? COLORS.surfaceDark : COLORS.surface,
            color: value === i ? COLORS.bg : isBlackNote(i) ? "#777" : "#bbb",
            border: "1px solid " + (value === i ? COLORS.accentBright : COLORS.border),
            borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", minWidth: "38px", transition: "all 0.15s",
          }}>{note}</button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          Intervals
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => setMode("identify")} style={{
          padding: "8px 16px", fontSize: "13px", fontWeight: mode === "identify" ? 700 : 400,
          background: mode === "identify" ? COLORS.accent : COLORS.surfaceDark,
          color: mode === "identify" ? "#fff" : COLORS.muted,
          border: "1px solid " + (mode === "identify" ? COLORS.accent : COLORS.borderDark),
          borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        }}>Two Notes &rarr; Interval</button>
        <button onClick={() => setMode("build")} style={{
          padding: "8px 16px", fontSize: "13px", fontWeight: mode === "build" ? 700 : 400,
          background: mode === "build" ? COLORS.accent : COLORS.surfaceDark,
          color: mode === "build" ? "#fff" : COLORS.muted,
          border: "1px solid " + (mode === "build" ? COLORS.accent : COLORS.borderDark),
          borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
        }}>Note + Interval &rarr; Note</button>
      </div>

      {mode === "identify" ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
            <NoteSelector value={note1} onChange={setNote1} label="First Note" />
            <NoteSelector value={note2} onChange={setNote2} label="Second Note" />
          </div>

          {/* Result */}
          <div style={{
            textAlign: "center", padding: "24px", background: COLORS.surfaceDark,
            borderRadius: "12px", border: "1px solid " + COLORS.borderDark, minWidth: "300px",
          }}>
            <div style={{ fontSize: "13px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
              {NOTES[note1]} &rarr; {NOTES[note2]}
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.accentBright, marginBottom: "8px" }}>
              {identified.name}
            </div>
            <div style={{ display: "flex", gap: "24px", justifyContent: "center", fontSize: "13px", color: COLORS.muted }}>
              <span>{identified.semitones} semitone{identified.semitones !== 1 ? "s" : ""}</span>
              <span>{identified.short}</span>
              <span>{identified.ratio}</span>
              <span>{identified.cents} cents</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <NoteSelector value={note1} onChange={setNote1} label="Starting Note" />

          {/* Interval selector */}
          <div>
            <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px", textAlign: "center" }}>
              Interval
            </div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", maxWidth: "600px" }}>
              {INTERVAL_FULL_NAMES.map(iv => (
                <button key={iv.semitones} onClick={() => setSelectedInterval(iv.semitones)} style={{
                  padding: "6px 10px", fontSize: "12px", fontWeight: selectedInterval === iv.semitones ? 700 : 400,
                  background: selectedInterval === iv.semitones ? COLORS.accent : COLORS.surfaceDark,
                  color: selectedInterval === iv.semitones ? "#fff" : COLORS.muted,
                  border: "1px solid " + (selectedInterval === iv.semitones ? COLORS.accent : COLORS.borderDark),
                  borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{iv.short}</button>
              ))}
            </div>
          </div>

          {/* Result */}
          <div style={{
            textAlign: "center", padding: "24px", background: COLORS.surfaceDark,
            borderRadius: "12px", border: "1px solid " + COLORS.borderDark, minWidth: "300px",
          }}>
            <div style={{ fontSize: "13px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
              {NOTES[note1]} + {INTERVAL_FULL_NAMES.find(iv => iv.semitones === selectedInterval)?.name}
            </div>
            <div style={{ fontSize: "42px", fontWeight: 700, color: COLORS.accentBright, marginBottom: "8px" }}>
              {NOTES[targetNote]}
            </div>
            <div style={{ fontSize: "13px", color: COLORS.muted }}>
              {selectedInterval} semitone{selectedInterval !== 1 ? "s" : ""} &middot; {INTERVAL_FULL_NAMES.find(iv => iv.semitones === selectedInterval)?.ratio} &middot; {INTERVAL_FULL_NAMES.find(iv => iv.semitones === selectedInterval)?.cents} cents
            </div>
          </div>
        </>
      )}

      {/* Reference table */}
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px", textAlign: "center" }}>
          Interval Reference
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={{ padding: "5px 8px", textAlign: "left", color: COLORS.dimmer, fontSize: "10px", letterSpacing: "1px", borderBottom: "1px solid " + COLORS.borderDark }}>Name</th>
              <th style={{ padding: "5px 8px", textAlign: "center", color: COLORS.dimmer, fontSize: "10px", letterSpacing: "1px", borderBottom: "1px solid " + COLORS.borderDark }}>Short</th>
              <th style={{ padding: "5px 8px", textAlign: "center", color: COLORS.dimmer, fontSize: "10px", letterSpacing: "1px", borderBottom: "1px solid " + COLORS.borderDark }}>Semi</th>
              <th style={{ padding: "5px 8px", textAlign: "center", color: COLORS.dimmer, fontSize: "10px", letterSpacing: "1px", borderBottom: "1px solid " + COLORS.borderDark }}>Ratio</th>
              <th style={{ padding: "5px 8px", textAlign: "right", color: COLORS.dimmer, fontSize: "10px", letterSpacing: "1px", borderBottom: "1px solid " + COLORS.borderDark }}>Cents</th>
            </tr>
          </thead>
          <tbody>
            {INTERVAL_FULL_NAMES.map(iv => (
              <tr key={iv.semitones} style={{
                background: (mode === "identify" && iv.semitones === identified.semitones) ||
                  (mode === "build" && iv.semitones === selectedInterval)
                  ? COLORS.accent + "30" : "transparent",
              }}>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid " + COLORS.borderDark, color: COLORS.text }}>{iv.name}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid " + COLORS.borderDark, textAlign: "center", color: COLORS.accentLight }}>{iv.short}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid " + COLORS.borderDark, textAlign: "center", color: COLORS.muted }}>{iv.semitones}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid " + COLORS.borderDark, textAlign: "center", color: COLORS.muted }}>{iv.ratio}</td>
                <td style={{ padding: "5px 8px", borderBottom: "1px solid " + COLORS.borderDark, textAlign: "right", color: COLORS.dim }}>{iv.cents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
