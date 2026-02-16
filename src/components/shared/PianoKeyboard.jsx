import { useMemo, useRef, useCallback, useEffect } from "react";
import { NOTES, isBlackNote, COLORS } from "../../utils/musicConstants.js";

export default function PianoKeyboard({ activeKeys, dimKeys, onKeyClick, totalKeys = 25 }) {
  const svgRef = useRef(null);
  const lastNoteRef = useRef(null);

  const pianoData = useMemo(() => {
    let whiteCount = 0;
    for (let i = 0; i < totalKeys; i++) {
      if (!isBlackNote(i % 12)) whiteCount++;
    }

    const whites = [];
    const blacks = [];
    const whiteW = 100 / whiteCount;
    let wIdx = 0;

    for (let i = 0; i < totalKeys; i++) {
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
    for (let i = 0; i < totalKeys; i++) {
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

    return { whites, blacks, whiteW };
  }, [activeKeys, dimKeys, totalKeys]);

  // Map screen coords to a note on the keyboard
  const getKeyAtPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    // Convert to viewBox coords (0-100 x, 0-36 y)
    const vx = ((clientX - rect.left) / rect.width) * 100;
    const vy = ((clientY - rect.top) / rect.height) * 36;
    if (vx < 0 || vx > 100 || vy < 0 || vy > 36) return null;

    // Check black keys first (only if in upper portion)
    if (vy <= 21) {
      for (const k of pianoData.blacks) {
        if (vx >= k.x + 0.1 && vx <= k.x + k.w - 0.1) {
          return k.noteInOctave;
        }
      }
    }
    // Check white keys
    for (const k of pianoData.whites) {
      if (vx >= k.x + 0.15 && vx <= k.x + k.w - 0.15) {
        return k.noteInOctave;
      }
    }
    return null;
  }, [pianoData]);

  // Touch handlers attached via useEffect with { passive: false }
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const note = getKeyAtPoint(touch.clientX, touch.clientY);
      if (note !== null) {
        lastNoteRef.current = note;
        onKeyClick(note);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const note = getKeyAtPoint(touch.clientX, touch.clientY);
      if (note !== null && note !== lastNoteRef.current) {
        lastNoteRef.current = note;
        onKeyClick(note);
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      lastNoteRef.current = null;
    };

    svg.addEventListener("touchstart", handleTouchStart, { passive: false });
    svg.addEventListener("touchmove", handleTouchMove, { passive: false });
    svg.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      svg.removeEventListener("touchstart", handleTouchStart);
      svg.removeEventListener("touchmove", handleTouchMove);
      svg.removeEventListener("touchend", handleTouchEnd);
    };
  }, [getKeyAtPoint, onKeyClick]);

  return (
    <div style={{ width: "100%", maxWidth: "1000px" }}>
      <svg ref={svgRef} viewBox="0 0 100 36" style={{ width: "100%", display: "block", touchAction: "none" }} preserveAspectRatio="xMidYMid meet">
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
