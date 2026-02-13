import { useState } from "react";
import { COLORS, GROOVE_PATTERNS, GROOVE_CATEGORIES } from "../../utils/musicConstants.js";

const ROW_COLORS = {
  kick: "#e05050",
  snare: "#50b0e0",
  hihat: "#e0c050",
};

const ROW_LABELS = ["Kick", "Snare", "Hi-hat"];
const ROW_KEYS = ["kick", "snare", "hihat"];

export default function GroovesTab() {
  const [selectedGroove, setSelectedGroove] = useState("Four on the Floor");

  const groove = GROOVE_PATTERNS[selectedGroove];
  const steps = groove.steps;
  const beatsPerMeasure = parseInt(groove.timeSignature.split("/")[0]);
  const stepsPerBeat = steps / beatsPerMeasure;

  // Grid dimensions
  const cellW = 28;
  const cellH = 28;
  const labelW = 56;
  const headerH = 20;
  const gridW = labelW + steps * cellW;
  const gridH = headerH + ROW_KEYS.length * cellH;

  return (
    <>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          {selectedGroove}
        </div>
        <div style={{ fontSize: "14px", color: COLORS.muted }}>
          {groove.timeSignature} &middot; {steps} steps
        </div>
      </div>

      {/* Grid visualization */}
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <svg width={gridW + 8} height={gridH + 8} viewBox={`0 0 ${gridW + 8} ${gridH + 8}`}
          style={{ display: "block", margin: "0 auto" }}>
          <rect x={0} y={0} width={gridW + 8} height={gridH + 8} fill="none" />

          {/* Step numbers / beat markers */}
          {Array.from({ length: steps }, (_, s) => {
            const isBeatStart = s % stepsPerBeat === 0;
            const beatNum = Math.floor(s / stepsPerBeat) + 1;
            return (
              <g key={"h" + s}>
                {/* Beat divider lines */}
                {isBeatStart && (
                  <line
                    x1={labelW + s * cellW + 4} y1={headerH + 4}
                    x2={labelW + s * cellW + 4} y2={headerH + ROW_KEYS.length * cellH + 4}
                    stroke={COLORS.border} strokeWidth={1.5} />
                )}
                {/* Beat numbers at top */}
                {isBeatStart && (
                  <text x={labelW + s * cellW + cellW * stepsPerBeat / 2 + 4} y={headerH - 2}
                    textAnchor="middle" fontSize="10" fill={COLORS.dim}
                    fontFamily="'JetBrains Mono', monospace">{beatNum}</text>
                )}
              </g>
            );
          })}

          {/* Rows */}
          {ROW_KEYS.map((key, rowIdx) => (
            <g key={key}>
              {/* Row label */}
              <text x={labelW - 4 + 4} y={headerH + rowIdx * cellH + cellH / 2 + 1 + 4}
                textAnchor="end" dominantBaseline="central" fontSize="10" fontWeight="600"
                fill={ROW_COLORS[key]} fontFamily="'JetBrains Mono', monospace">
                {ROW_LABELS[rowIdx]}
              </text>

              {/* Row background */}
              <rect x={labelW + 4} y={headerH + rowIdx * cellH + 4}
                width={steps * cellW} height={cellH}
                fill={rowIdx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"} />

              {/* Step cells */}
              {groove[key].map((val, s) => {
                const cx = labelW + s * cellW + cellW / 2 + 4;
                const cy = headerH + rowIdx * cellH + cellH / 2 + 4;
                const r = val === 1 ? 8 : val === 0.5 ? 6 : 0;
                const opacity = val === 1 ? 0.9 : val === 0.5 ? 0.4 : 0;

                return (
                  <g key={s}>
                    {/* Cell border */}
                    <rect x={labelW + s * cellW + 4} y={headerH + rowIdx * cellH + 4}
                      width={cellW} height={cellH}
                      fill="transparent" stroke={COLORS.borderDim} strokeWidth={0.3} />
                    {/* Hit circle */}
                    {val > 0 && (
                      <circle cx={cx} cy={cy} r={r} fill={ROW_COLORS[key]} opacity={opacity} />
                    )}
                    {/* Empty dot */}
                    {val === 0 && (
                      <circle cx={cx} cy={cy} r={2} fill={COLORS.borderDim} opacity={0.5} />
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", fontSize: "11px", color: COLORS.dim }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14"><circle cx="7" cy="7" r="6" fill={COLORS.muted} opacity={0.9} /></svg>
          Hit
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14"><circle cx="7" cy="7" r="5" fill={COLORS.muted} opacity={0.4} /></svg>
          Ghost
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14"><circle cx="7" cy="7" r="2" fill={COLORS.borderDim} opacity={0.5} /></svg>
          Rest
        </span>
      </div>

      {/* Groove selector by category */}
      <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {Object.entries(GROOVE_CATEGORIES).map(([cat, grooves]) => (
          <div key={cat}>
            <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>{cat}</div>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {grooves.map(name => (
                <button key={name} onClick={() => setSelectedGroove(name)} style={{
                  padding: "6px 12px", fontSize: "13px", fontWeight: selectedGroove === name ? 700 : 400,
                  background: selectedGroove === name ? COLORS.accent : COLORS.surfaceDark,
                  color: selectedGroove === name ? "#fff" : COLORS.muted,
                  border: "1px solid " + (selectedGroove === name ? COLORS.accent : COLORS.borderDark),
                  borderRadius: "5px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>{name}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
