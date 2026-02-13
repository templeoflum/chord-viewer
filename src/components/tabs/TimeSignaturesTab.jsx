import { useState } from "react";
import { COLORS, TIME_SIGNATURES } from "../../utils/musicConstants.js";

export default function TimeSignaturesTab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = TIME_SIGNATURES[selectedIdx];
  const groups = selected.grouping.split("+").map(Number);

  // Beat visualization dimensions
  const beatR = 14;
  const beatGap = 40;
  const totalBeats = selected.beats;
  const vizW = totalBeats * beatGap + 20;
  const vizH = 80;

  return (
    <>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "4px", color: "#fff", marginBottom: "4px" }}>
          {selected.sig}
        </div>
        <div style={{ fontSize: "18px", color: COLORS.muted, marginBottom: "4px" }}>
          {selected.name}
        </div>
        <div style={{ fontSize: "13px", color: COLORS.dim }}>
          {selected.genres}
        </div>
      </div>

      {/* Beat visualization */}
      <div style={{ overflowX: "auto" }}>
        <svg width={vizW} height={vizH} viewBox={`0 0 ${vizW} ${vizH}`}
          style={{ display: "block", margin: "0 auto" }}>
          {selected.accents.map((accent, i) => {
            const cx = 10 + beatGap / 2 + i * beatGap;
            const cy = vizH / 2;
            const isStrong = accent === 3;
            const isMedium = accent === 2;
            const r = isStrong ? beatR : isMedium ? beatR * 0.75 : beatR * 0.55;
            const fill = isStrong ? COLORS.accentBright : isMedium ? COLORS.accent : COLORS.dim;
            const opacity = isStrong ? 1 : isMedium ? 0.8 : 0.5;

            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
                  fontSize={isStrong ? "11" : "9"} fontWeight={isStrong ? "800" : "500"}
                  fill={isStrong ? COLORS.bg : "#fff"}
                  fontFamily="'JetBrains Mono', monospace">
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Group brackets */}
          {groups.length > 1 && (() => {
            let beatOffset = 0;
            return groups.map((groupSize, gi) => {
              const startX = 10 + beatGap / 2 + beatOffset * beatGap;
              const endX = 10 + beatGap / 2 + (beatOffset + groupSize - 1) * beatGap;
              const y = vizH / 2 + beatR + 10;
              beatOffset += groupSize;
              return (
                <g key={"g" + gi}>
                  <line x1={startX} y1={y} x2={endX} y2={y}
                    stroke={COLORS.accentLight} strokeWidth={2} />
                  <line x1={startX} y1={y - 3} x2={startX} y2={y + 3}
                    stroke={COLORS.accentLight} strokeWidth={2} />
                  <line x1={endX} y1={y - 3} x2={endX} y2={y + 3}
                    stroke={COLORS.accentLight} strokeWidth={2} />
                  <text x={(startX + endX) / 2} y={y + 14} textAnchor="middle"
                    fontSize="10" fill={COLORS.accentLight}
                    fontFamily="'JetBrains Mono', monospace">{groupSize}</text>
                </g>
              );
            });
          })()}
        </svg>
      </div>

      {/* Grouping info */}
      <div style={{
        width: "100%", maxWidth: "400px", padding: "16px 20px",
        background: COLORS.surfaceDark, borderRadius: "10px",
        border: "1px solid " + COLORS.borderDark,
        display: "flex", flexDirection: "column", gap: "8px", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: COLORS.dimmer, textTransform: "uppercase", letterSpacing: "1px" }}>Beats</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>{selected.beats}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: COLORS.dimmer, textTransform: "uppercase", letterSpacing: "1px" }}>Division</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>1/{selected.division}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: COLORS.dimmer, textTransform: "uppercase", letterSpacing: "1px" }}>Grouping</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: COLORS.accentLight }}>{selected.grouping}</div>
          </div>
        </div>
      </div>

      {/* Accent pattern as dots legend */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
          Accent Pattern
        </div>
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
          {selected.accents.map((a, i) => (
            <div key={i} style={{
              width: a === 3 ? 24 : a === 2 ? 18 : 12,
              height: a === 3 ? 24 : a === 2 ? 18 : 12,
              borderRadius: "50%",
              background: a === 3 ? COLORS.accentBright : a === 2 ? COLORS.accent : COLORS.dim,
              opacity: a === 3 ? 1 : a === 2 ? 0.7 : 0.4,
              alignSelf: "center",
            }} />
          ))}
        </div>
        <div style={{ fontSize: "11px", color: COLORS.dim, marginTop: "8px" }}>
          Large = strong &middot; Medium = moderate &middot; Small = weak
        </div>
      </div>

      {/* Time signature selector */}
      <div style={{ width: "100%", maxWidth: "720px" }}>
        <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
          Time Signatures
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {TIME_SIGNATURES.map((ts, i) => (
            <button key={ts.sig} onClick={() => setSelectedIdx(i)} style={{
              padding: "10px 16px", fontSize: "16px", fontWeight: selectedIdx === i ? 800 : 500,
              background: selectedIdx === i ? COLORS.accent : COLORS.surfaceDark,
              color: selectedIdx === i ? "#fff" : COLORS.text,
              border: "1px solid " + (selectedIdx === i ? COLORS.accent : COLORS.borderDark),
              borderRadius: "8px", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s", minWidth: "56px", textAlign: "center",
            }}>
              <div>{ts.sig}</div>
              <div style={{ fontSize: "9px", color: selectedIdx === i ? "rgba(255,255,255,0.7)" : COLORS.dim, marginTop: "2px" }}>
                {ts.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
