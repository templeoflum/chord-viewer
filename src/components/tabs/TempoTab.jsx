import { useState, useMemo } from "react";
import { COLORS } from "../../utils/musicConstants.js";

// All subdivisions expressed as fraction of a whole note (4 beats)
// Includes standard binary AND compound/tuplet divisions
const SUBDIVISIONS = [
  { name: "2 Bars",  frac: "2/1",   beats: 8 },
  { name: "Whole",   frac: "1/1",   beats: 4 },
  { name: "1/2",     frac: "1/2",   beats: 2 },
  { name: "1/2T",    frac: "1/2T",  beats: 4/3 },
  { name: "1/3",     frac: "1/3",   beats: 4/3 },
  { name: "1/4",     frac: "1/4",   beats: 1 },
  { name: "1/4D",    frac: "1/4D",  beats: 1.5 },
  { name: "1/4T",    frac: "1/4T",  beats: 2/3 },
  { name: "1/6",     frac: "1/6",   beats: 2/3 },
  { name: "1/8",     frac: "1/8",   beats: 0.5 },
  { name: "1/8D",    frac: "1/8D",  beats: 0.75 },
  { name: "1/8T",    frac: "1/8T",  beats: 1/3 },
  { name: "1/12",    frac: "1/12",  beats: 1/3 },
  { name: "1/16",    frac: "1/16",  beats: 0.25 },
  { name: "1/16D",   frac: "1/16D", beats: 0.375 },
  { name: "1/16T",   frac: "1/16T", beats: 1/6 },
  { name: "1/24",    frac: "1/24",  beats: 1/6 },
  { name: "1/32",    frac: "1/32",  beats: 0.125 },
  { name: "1/32D",   frac: "1/32D", beats: 0.1875 },
  { name: "1/32T",   frac: "1/32T", beats: 1/12 },
  { name: "1/48",    frac: "1/48",  beats: 1/12 },
  { name: "1/64",    frac: "1/64",  beats: 0.0625 },
  { name: "1/64D",   frac: "1/64D", beats: 0.09375 },
  { name: "1/64T",   frac: "1/64T", beats: 1/24 },
  { name: "1/96",    frac: "1/96",  beats: 1/24 },
  { name: "1/128",   frac: "1/128", beats: 0.03125 },
];

// Group labels for visual separation
const GROUPS = [
  { label: "Whole / Half", start: 0, end: 4 },
  { label: "Quarter", start: 5, end: 8 },
  { label: "Eighth", start: 9, end: 12 },
  { label: "Sixteenth", start: 13, end: 16 },
  { label: "Thirty-second", start: 17, end: 20 },
  { label: "Sixty-fourth+", start: 21, end: 25 },
];

function calcMs(beats, bpm) { return beats * 60000 / bpm; }
function calcHz(ms) { return ms > 0 ? 1000 / ms : 0; }
function fmtTime(ms) {
  if (ms >= 1000) return (ms / 1000).toFixed(3) + " s";
  if (ms >= 1) return ms.toFixed(1) + " ms";
  return (ms * 1000).toFixed(1) + " \u00B5s";
}

const cellStyle = {
  padding: "5px 12px", textAlign: "right",
  borderBottom: "1px solid " + COLORS.borderDark, whiteSpace: "nowrap",
};
const headerCellStyle = {
  ...cellStyle, textAlign: "center", color: COLORS.dimmer,
  fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",
  position: "sticky", top: 0, background: COLORS.bg, zIndex: 1,
};
const groupHeaderStyle = {
  padding: "8px 12px", textAlign: "left",
  fontSize: "10px", color: COLORS.dimmer, letterSpacing: "2px",
  textTransform: "uppercase", background: COLORS.surfaceDark,
  borderBottom: "1px solid " + COLORS.border,
};

export default function TempoTab() {
  const [bpm, setBpm] = useState(120);

  const rows = useMemo(() => {
    return SUBDIVISIONS.map(sub => {
      const ms = calcMs(sub.beats, bpm);
      return {
        name: sub.name,
        frac: sub.frac,
        ms,
        hz: calcHz(ms),
        samples48: Math.round(ms * 48),
        beats: sub.beats,
      };
    });
  }, [bpm]);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          {bpm} BPM
        </div>
      </div>

      {/* BPM controls */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%", maxWidth: "500px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={() => setBpm(b => Math.max(1, b - 1))} style={{
            padding: "6px 14px", fontSize: "16px", background: COLORS.surfaceDark,
            color: COLORS.text, border: "1px solid " + COLORS.borderDark,
            borderRadius: "6px", cursor: "pointer", fontFamily: "inherit",
          }}>&minus;</button>
          <input type="number" value={bpm} min={1} max={300}
            onChange={e => setBpm(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)))}
            style={{
              width: "80px", padding: "6px 8px", fontSize: "18px", textAlign: "center",
              background: COLORS.surface, color: "#fff", border: "1px solid " + COLORS.border,
              borderRadius: "6px", fontFamily: "inherit", outline: "none",
            }} />
          <button onClick={() => setBpm(b => Math.min(300, b + 1))} style={{
            padding: "6px 14px", fontSize: "16px", background: COLORS.surfaceDark,
            color: COLORS.text, border: "1px solid " + COLORS.borderDark,
            borderRadius: "6px", cursor: "pointer", fontFamily: "inherit",
          }}>+</button>
        </div>
        <input type="range" min={20} max={300} value={bpm}
          onChange={e => setBpm(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: COLORS.accent }} />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
          {[60, 80, 100, 120, 140, 160, 180, 200].map(v => (
            <button key={v} onClick={() => setBpm(v)} style={{
              padding: "4px 10px", fontSize: "12px", fontWeight: bpm === v ? 700 : 400,
              background: bpm === v ? COLORS.accent : COLORS.surfaceDark,
              color: bpm === v ? "#fff" : COLORS.muted,
              border: "1px solid " + (bpm === v ? COLORS.accent : COLORS.borderDark),
              borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Timing table */}
      <div style={{
        width: "100%", maxWidth: "720px", maxHeight: "60vh", overflowY: "auto",
        borderRadius: "8px", border: "1px solid " + COLORS.borderDark,
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, textAlign: "left" }}>Division</th>
              <th style={headerCellStyle}>Time</th>
              <th style={headerCellStyle}>Freq (Hz)</th>
              <th style={headerCellStyle}>Samples (48k)</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.flatMap((group) => {
              const groupRows = rows.slice(group.start, group.end + 1);
              return [
                <tr key={"g-" + group.label}>
                  <td colSpan={4} style={groupHeaderStyle}>{group.label}</td>
                </tr>,
                ...groupRows.map((r, i) => {
                  const isTriplet = r.frac.endsWith("T");
                  const isDotted = r.frac.endsWith("D");
                  const isCompound = !isTriplet && !isDotted && (
                    r.frac === "1/3" || r.frac === "1/6" || r.frac === "1/12" ||
                    r.frac === "1/24" || r.frac === "1/48" || r.frac === "1/96"
                  );
                  return (
                    <tr key={r.frac} style={{
                      background: i % 2 === 0 ? "transparent" : COLORS.surfaceDark + "30",
                    }}>
                      <td style={{
                        ...cellStyle, textAlign: "left", fontWeight: 500,
                        color: isCompound ? "#e9a04f" : isTriplet ? "#6db8d4" : isDotted ? "#8b9dc3" : COLORS.text,
                      }}>{r.name}</td>
                      <td style={{ ...cellStyle, color: COLORS.accentLight }}>{fmtTime(r.ms)}</td>
                      <td style={{ ...cellStyle, color: COLORS.dim }}>{r.hz.toFixed(3)}</td>
                      <td style={{ ...cellStyle, color: COLORS.dim }}>{r.samples48.toLocaleString()}</td>
                    </tr>
                  );
                }),
              ];
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", fontSize: "11px" }}>
        <span style={{ color: COLORS.text }}>Straight</span>
        <span style={{ color: "#8b9dc3" }}>D = Dotted</span>
        <span style={{ color: "#6db8d4" }}>T = Triplet</span>
        <span style={{ color: "#e9a04f" }}>Compound (1/3, 1/6...)</span>
      </div>
    </>
  );
}
