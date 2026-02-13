import { useState, useMemo } from "react";
import { NOTES, COLORS, CIRCLE_OF_FIFTHS, getDiatonicChords } from "../../utils/musicConstants.js";

export default function CircleOfFifthsTab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = CIRCLE_OF_FIFTHS[selectedIdx];

  const diatonicChords = useMemo(() => {
    const rootIdx = NOTES.indexOf(selected.major) !== -1
      ? NOTES.indexOf(selected.major)
      : (selected.major === "Db" ? 1 : selected.major === "Ab" ? 8 :
         selected.major === "Eb" ? 3 : selected.major === "Bb" ? 10 : 0);
    return getDiatonicChords(rootIdx, "Major");
  }, [selected]);

  // Neighbor indices (IV and V)
  const prevIdx = (selectedIdx - 1 + 12) % 12;
  const nextIdx = (selectedIdx + 1) % 12;

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "4px" }}>
          {selected.major} Major
        </div>
        <div style={{ fontSize: "15px", color: COLORS.muted }}>
          Relative minor: {selected.minor}
        </div>
      </div>

      {/* SVG Circle of Fifths */}
      <div>
        <svg width="340" height="340" viewBox="-170 -170 340 340">
          {/* Background circles */}
          <circle cx={0} cy={0} r={140} fill="none" stroke={COLORS.borderDim} strokeWidth={0.8} />
          <circle cx={0} cy={0} r={90} fill="none" stroke={COLORS.borderDim} strokeWidth={0.6} />

          {CIRCLE_OF_FIFTHS.map((entry, i) => {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const outerX = Math.cos(angle) * 140;
            const outerY = Math.sin(angle) * 140;
            const innerX = Math.cos(angle) * 90;
            const innerY = Math.sin(angle) * 90;
            const isSelected = i === selectedIdx;
            const isNeighbor = i === prevIdx || i === nextIdx;

            return (
              <g key={i} onClick={() => setSelectedIdx(i)} style={{ cursor: "pointer" }}>
                {/* Outer ring - Major keys */}
                <circle cx={outerX} cy={outerY} r={20}
                  fill={isSelected ? COLORS.accentBright : isNeighbor ? COLORS.accent : COLORS.surfaceDark}
                  stroke={isSelected ? COLORS.accentBright : isNeighbor ? COLORS.accentLight : COLORS.border}
                  strokeWidth={1} opacity={isSelected ? 1 : isNeighbor ? 0.8 : 0.9} />
                <text x={outerX} y={outerY + 1} textAnchor="middle" dominantBaseline="central"
                  fontSize="11" fontWeight={isSelected ? "800" : isNeighbor ? "600" : "500"}
                  fill={isSelected ? COLORS.bg : isNeighbor ? "#fff" : COLORS.text}
                  fontFamily="'JetBrains Mono', monospace">{entry.major}</text>

                {/* Inner ring - Minor keys */}
                <circle cx={innerX} cy={innerY} r={16}
                  fill={isSelected ? "#5b2da0" : COLORS.surfaceDark}
                  stroke={isSelected ? COLORS.accentLight : COLORS.borderDark}
                  strokeWidth={0.8} opacity={0.9} />
                <text x={innerX} y={innerY + 1} textAnchor="middle" dominantBaseline="central"
                  fontSize="9" fontWeight={isSelected ? "700" : "400"}
                  fill={isSelected ? "#ddd" : COLORS.dim}
                  fontFamily="'JetBrains Mono', monospace">{entry.minor}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Key signature info */}
      <div style={{
        width: "100%", maxWidth: "500px", padding: "20px",
        background: COLORS.surfaceDark, borderRadius: "12px",
        border: "1px solid " + COLORS.borderDark,
        display: "flex", flexDirection: "column", gap: "12px", alignItems: "center",
      }}>
        <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase" }}>
          Key Signature
        </div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>
          {selected.sharps > 0
            ? `${selected.sharps} sharp${selected.sharps > 1 ? "s" : ""}`
            : selected.flats > 0
            ? `${selected.flats} flat${selected.flats > 1 ? "s" : ""}`
            : "No sharps or flats"}
        </div>
        {selected.sig && (
          <div style={{ fontSize: "14px", color: COLORS.muted, letterSpacing: "2px" }}>
            {selected.sig}
          </div>
        )}

        {/* Neighbor keys */}
        <div style={{ display: "flex", gap: "24px", marginTop: "4px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: COLORS.dimmer, textTransform: "uppercase", letterSpacing: "1px" }}>IV</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: COLORS.accentLight }}>{CIRCLE_OF_FIFTHS[prevIdx].major}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: COLORS.dimmer, textTransform: "uppercase", letterSpacing: "1px" }}>I</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>{selected.major}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: COLORS.dimmer, textTransform: "uppercase", letterSpacing: "1px" }}>V</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: COLORS.accentLight }}>{CIRCLE_OF_FIFTHS[nextIdx].major}</div>
          </div>
        </div>
      </div>

      {/* Diatonic chords */}
      {diatonicChords && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: COLORS.dimmer, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            Diatonic Chords in {selected.major} Major
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {diatonicChords.map((chord, i) => (
              <div key={i} style={{
                padding: "8px 14px", fontSize: "15px", fontWeight: 600,
                background: COLORS.surfaceDark, color: COLORS.text,
                border: "1px solid " + COLORS.borderDark, borderRadius: "6px",
                minWidth: "48px", textAlign: "center",
              }}>
                <div>{chord}</div>
                <div style={{ fontSize: "10px", color: COLORS.dim, marginTop: "2px" }}>
                  {["I", "ii", "iii", "IV", "V", "vi", "vii\u00B0"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
