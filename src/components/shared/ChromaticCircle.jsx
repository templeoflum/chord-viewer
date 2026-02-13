import { NOTES, COLORS } from "../../utils/musicConstants.js";

export default function ChromaticCircle({ root, activeNotes, dimNotes, onNoteClick }) {
  const activeSet = new Set(activeNotes);
  const dimSet = new Set(dimNotes || []);

  return (
    <div style={{ marginTop: "4px" }}>
      <svg width="200" height="200" viewBox="-105 -105 210 210">
        <circle cx={0} cy={0} r={88} fill="none" stroke={COLORS.borderDim} strokeWidth={0.8} />
        {/* Dim notes polygon (background layer) */}
        {dimNotes && dimNotes.length > 1 && (
          <polygon
            points={dimNotes.map(n => {
              const s = (n - root + 12) % 12;
              const a = (s * 30 - 90) * Math.PI / 180;
              return Math.cos(a) * 88 + "," + Math.sin(a) * 88;
            }).join(" ")}
            fill="#4a3280" fillOpacity={0.06} stroke="#6040a0" strokeWidth={0.6} strokeOpacity={0.3} />
        )}
        {/* Active notes polygon (foreground layer) */}
        {activeNotes.length > 1 && (
          <polygon
            points={activeNotes.map(n => {
              const s = (n - root + 12) % 12;
              const a = (s * 30 - 90) * Math.PI / 180;
              return Math.cos(a) * 88 + "," + Math.sin(a) * 88;
            }).join(" ")}
            fill={COLORS.accent} fillOpacity={0.08} stroke={COLORS.accentLight} strokeWidth={0.8} strokeOpacity={0.4} />
        )}
        {NOTES.map((_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          const x = Math.cos(a) * 88, y = Math.sin(a) * 88;
          const actual = (root + i) % 12;
          const active = activeSet.has(actual);
          const dim = dimSet.has(actual);
          const isR = i === 0;
          return (
            <g key={i} onClick={() => onNoteClick(actual)} style={{ cursor: "pointer" }}>
              {active && <circle cx={x} cy={y} r={12} fill={isR ? COLORS.accentBright : COLORS.accent} opacity={0.9} />}
              {!active && dim && <circle cx={x} cy={y} r={10} fill="#4a3280" opacity={0.5} />}
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central"
                fontSize={active ? "10" : dim ? "9" : "8"} fontWeight={active ? "700" : dim ? "500" : "400"}
                fill={active ? (isR ? COLORS.bg : "#fff") : dim ? "#a080d0" : COLORS.dimmer}
                fontFamily="'JetBrains Mono', monospace">{NOTES[actual]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
