import { useState, useMemo } from "react";
import { COLORS, generateFrequencyTable } from "../../utils/musicConstants.js";

const allRows = generateFrequencyTable();

const cellStyle = {
  padding: "5px 12px", borderBottom: "1px solid " + COLORS.borderDark,
};
const headerCellStyle = {
  ...cellStyle, color: COLORS.dimmer,
  fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
  position: "sticky", top: 0, background: COLORS.bg, zIndex: 1,
};

export default function FrequenciesTab() {
  const [filter, setFilter] = useState("");

  const rows = useMemo(() => {
    if (!filter) return allRows;
    const q = filter.toLowerCase();
    return allRows.filter(r =>
      r.note.toLowerCase().includes(q) ||
      r.octave.toString().includes(q) ||
      r.midi.toString().includes(q) ||
      r.frequency.toFixed(2).includes(q)
    );
  }, [filter]);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          Frequencies
        </div>
        <div style={{ fontSize: "15px", color: COLORS.muted, letterSpacing: "3px" }}>A4 = 440 Hz</div>
      </div>

      <input
        type="text" placeholder="Filter by note, octave, MIDI..." value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{
          width: "100%", maxWidth: "400px", padding: "8px 14px", fontSize: "14px",
          background: COLORS.surface, color: COLORS.text,
          border: "1px solid " + COLORS.border, borderRadius: "6px",
          fontFamily: "inherit", outline: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "600px", maxHeight: "60vh", overflowY: "auto", borderRadius: "8px", border: "1px solid " + COLORS.borderDark }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, textAlign: "left" }}>Note</th>
              <th style={{ ...headerCellStyle, textAlign: "center" }}>Octave</th>
              <th style={{ ...headerCellStyle, textAlign: "right" }}>Frequency (Hz)</th>
              <th style={{ ...headerCellStyle, textAlign: "right" }}>MIDI #</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const isA4 = r.midi === 69;
              return (
                <tr key={r.midi} style={{
                  background: isA4 ? COLORS.accent + "30" : r.isBlack ? COLORS.surfaceDark + "40" : "transparent",
                }}>
                  <td style={{
                    ...cellStyle, textAlign: "left",
                    fontWeight: isA4 ? 700 : r.isBlack ? 400 : 500,
                    color: isA4 ? COLORS.accentBright : r.isBlack ? COLORS.muted : COLORS.text,
                  }}>{r.note}</td>
                  <td style={{ ...cellStyle, textAlign: "center", color: COLORS.muted }}>{r.octave}</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: isA4 ? COLORS.accentBright : COLORS.accentLight, fontWeight: isA4 ? 700 : 400 }}>
                    {r.frequency.toFixed(2)}
                  </td>
                  <td style={{ ...cellStyle, textAlign: "right", color: COLORS.dim }}>{r.midi}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
