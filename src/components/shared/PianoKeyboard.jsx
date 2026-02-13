import { useMemo } from "react";
import { NOTES, isBlackNote, TOTAL_KEYS, WHITE_COUNT, COLORS } from "../../utils/musicConstants.js";

export default function PianoKeyboard({ activeKeys, dimKeys, onKeyClick }) {
  const pianoData = useMemo(() => {
    const whites = [];
    const blacks = [];
    const whiteW = 100 / WHITE_COUNT;
    let wIdx = 0;

    for (let i = 0; i < TOTAL_KEYS; i++) {
      const noteInOctave = i % 12;
      if (!isBlackNote(noteInOctave)) {
        const isActive = activeKeys.has(i);
        const interval = activeKeys.get(i) || null;
        const isRoot = interval === "R";
        const isDim = dimKeys ? dimKeys.has(i) : false;
        const dimInterval = dimKeys ? dimKeys.get(i) || null : null;
        whites.push({
          pos: i, noteInOctave, noteName: NOTES[noteInOctave],
          isActive, isRoot, interval, isDim, dimInterval,
          x: wIdx * whiteW, w: whiteW,
        });
        wIdx++;
      }
    }

    wIdx = 0;
    for (let i = 0; i < TOTAL_KEYS; i++) {
      const noteInOctave = i % 12;
      if (isBlackNote(noteInOctave)) {
        const isActive = activeKeys.has(i);
        const interval = activeKeys.get(i) || null;
        const isRoot = interval === "R";
        const isDim = dimKeys ? dimKeys.has(i) : false;
        const dimInterval = dimKeys ? dimKeys.get(i) || null : null;
        blacks.push({
          pos: i, noteInOctave, noteName: NOTES[noteInOctave],
          isActive, isRoot, interval, isDim, dimInterval,
          x: wIdx * whiteW - whiteW * 0.3, w: whiteW * 0.6,
        });
      } else {
        wIdx++;
      }
    }

    return { whites, blacks };
  }, [activeKeys, dimKeys]);

  return (
    <div style={{ width: "100%", maxWidth: "1000px" }}>
      <svg viewBox="0 0 100 36" style={{ width: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
        {pianoData.whites.map((k) => (
          <g key={"w" + k.pos} onClick={() => onKeyClick(k.noteInOctave)} style={{ cursor: "pointer" }}>
            <rect x={k.x + 0.15} y={0} width={k.w - 0.3} height={34} rx={0.6}
              fill={k.isRoot ? COLORS.accentBright : k.isActive ? COLORS.accent : k.isDim ? "#2d1f5e" : COLORS.surface}
              stroke={k.isActive ? COLORS.accentLight : k.isDim ? "#4a3280" : COLORS.border} strokeWidth={0.2} />
            {k.isActive && k.interval && (
              <text x={k.x + k.w / 2} y={27.5} textAnchor="middle" fontSize="1.8" fontWeight="700"
                fill={k.isRoot ? COLORS.bg : COLORS.text}>{k.interval}</text>
            )}
            {!k.isActive && k.isDim && k.dimInterval && (
              <text x={k.x + k.w / 2} y={27.5} textAnchor="middle" fontSize="1.6" fontWeight="500"
                fill="#9070d0" opacity={0.6}>{k.dimInterval}</text>
            )}
            <text x={k.x + k.w / 2} y={32} textAnchor="middle" fontSize="1.2"
              fill={k.isActive ? (k.isRoot ? COLORS.bg : COLORS.accentLight) : k.isDim ? "#7060a0" : COLORS.faint}>{k.noteName}</text>
          </g>
        ))}
        {pianoData.blacks.map((k) => (
          <g key={"b" + k.pos} onClick={() => onKeyClick(k.noteInOctave)} style={{ cursor: "pointer" }}>
            <rect x={k.x + 0.1} y={0} width={k.w - 0.2} height={21} rx={0.5}
              fill={k.isRoot ? COLORS.accentBright : k.isActive ? COLORS.accent : k.isDim ? "#1e1548" : COLORS.keyBlack}
              stroke={k.isActive ? COLORS.accentLight : k.isDim ? "#3a2870" : COLORS.keyBlackBorder} strokeWidth={0.2} />
            {k.isActive && k.interval && (
              <text x={k.x + k.w / 2} y={17} textAnchor="middle" fontSize="1.5" fontWeight="700"
                fill={k.isRoot ? COLORS.bg : COLORS.text}>{k.interval}</text>
            )}
            {!k.isActive && k.isDim && k.dimInterval && (
              <text x={k.x + k.w / 2} y={17} textAnchor="middle" fontSize="1.3" fontWeight="500"
                fill="#9070d0" opacity={0.5}>{k.dimInterval}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
