import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { NOTES, COLORS, CIRCLE_OF_FIFTHS, getDiatonicChords } from "../../utils/musicConstants.js";

export default function CircleOfFifthsTab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartAngle = useRef(0);
  const svgRef = useRef(null);
  const wasDragged = useRef(false);

  const selected = CIRCLE_OF_FIFTHS[selectedIdx];

  const diatonicChords = useMemo(() => {
    const rootIdx = NOTES.indexOf(selected.major) !== -1
      ? NOTES.indexOf(selected.major)
      : (selected.major === "Db" ? 1 : selected.major === "Ab" ? 8 :
         selected.major === "Eb" ? 3 : selected.major === "Bb" ? 10 : 0);
    return getDiatonicChords(rootIdx, "Major");
  }, [selected]);

  const prevIdx = (selectedIdx - 1 + 12) % 12;
  const nextIdx = (selectedIdx + 1) % 12;

  const getAngleFromCenter = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
  }, []);

  const finishDrag = useCallback((totalRotation) => {
    // Snap to nearest 30 degrees
    const snapped = Math.round(totalRotation / 30) * 30;
    const steps = snapped / 30;
    // Each 30° clockwise = -1 step in the circle array (fifths go clockwise)
    const newIdx = ((-steps % 12) + 12) % 12;
    setSelectedIdx(newIdx);
    setRotationOffset(snapped);
    setDragDelta(0);
    setIsDragging(false);
  }, []);

  // Touch handlers via useEffect with { passive: false }
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      dragStartAngle.current = getAngleFromCenter(touch.clientX, touch.clientY);
      wasDragged.current = false;
      setIsDragging(true);
      setDragDelta(0);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const currentAngle = getAngleFromCenter(touch.clientX, touch.clientY);
      let delta = currentAngle - dragStartAngle.current;
      // Wrap around ±180
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      if (Math.abs(delta) > 3) wasDragged.current = true;
      setDragDelta(delta);
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      if (!wasDragged.current) {
        setDragDelta(0);
        setIsDragging(false);
        return;
      }
      // Read dragDelta from the latest state by computing it fresh
      const totalRotation = rotationOffset + dragDelta;
      finishDrag(totalRotation);
    };

    svg.addEventListener("touchstart", handleTouchStart, { passive: false });
    svg.addEventListener("touchmove", handleTouchMove, { passive: false });
    svg.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      svg.removeEventListener("touchstart", handleTouchStart);
      svg.removeEventListener("touchmove", handleTouchMove);
      svg.removeEventListener("touchend", handleTouchEnd);
    };
  }, [getAngleFromCenter, rotationOffset, dragDelta, finishDrag]);

  // Mouse drag support
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    dragStartAngle.current = getAngleFromCenter(e.clientX, e.clientY);
    wasDragged.current = false;
    setIsDragging(true);
    setDragDelta(0);

    const handleMouseMove = (e) => {
      const currentAngle = getAngleFromCenter(e.clientX, e.clientY);
      let delta = currentAngle - dragStartAngle.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      if (Math.abs(delta) > 3) wasDragged.current = true;
      setDragDelta(delta);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // We need to get the latest delta from state, but since this is a closure,
      // we use a ref-based approach via the state updater
      setDragDelta(prevDelta => {
        if (!wasDragged.current) {
          setIsDragging(false);
          return 0;
        }
        setRotationOffset(prevOffset => {
          const total = prevOffset + prevDelta;
          const snapped = Math.round(total / 30) * 30;
          const steps = snapped / 30;
          const newIdx = ((-steps % 12) + 12) % 12;
          setSelectedIdx(newIdx);
          setIsDragging(false);
          return snapped;
        });
        return 0;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [getAngleFromCenter]);

  const handleClick = useCallback((i) => {
    if (wasDragged.current) return;
    setSelectedIdx(i);
    // Reset rotation so clicked key is at top
    setRotationOffset(-i * 30);
    setDragDelta(0);
  }, []);

  const totalRotation = rotationOffset + dragDelta;

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
        <svg ref={svgRef} viewBox="-170 -170 340 340"
          style={{ width: "100%", maxWidth: "340px", display: "block", cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
          onMouseDown={handleMouseDown}>
          {/* Rotatable group */}
          <g style={{
            transform: `rotate(${totalRotation}deg)`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}>
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

              // Counter-rotate text so it stays upright
              const textRotation = -totalRotation;

              return (
                <g key={i} onClick={() => handleClick(i)} style={{ cursor: "pointer" }}>
                  {/* Outer ring - Major keys */}
                  <circle cx={outerX} cy={outerY} r={20}
                    fill={isSelected ? COLORS.accentBright : isNeighbor ? COLORS.accent : COLORS.surfaceDark}
                    stroke={isSelected ? COLORS.accentBright : isNeighbor ? COLORS.accentLight : COLORS.border}
                    strokeWidth={1} opacity={isSelected ? 1 : isNeighbor ? 0.8 : 0.9} />
                  <text x={outerX} y={outerY + 1} textAnchor="middle" dominantBaseline="central"
                    fontSize="11" fontWeight={isSelected ? "800" : isNeighbor ? "600" : "500"}
                    fill={isSelected ? COLORS.bg : isNeighbor ? "#fff" : COLORS.text}
                    fontFamily="'JetBrains Mono', monospace"
                    style={{ transform: `rotate(${textRotation}deg)`, transformOrigin: `${outerX}px ${outerY}px` }}>{entry.major}</text>

                  {/* Inner ring - Minor keys */}
                  <circle cx={innerX} cy={innerY} r={16}
                    fill={isSelected ? "#5b2da0" : COLORS.surfaceDark}
                    stroke={isSelected ? COLORS.accentLight : COLORS.borderDark}
                    strokeWidth={0.8} opacity={0.9} />
                  <text x={innerX} y={innerY + 1} textAnchor="middle" dominantBaseline="central"
                    fontSize="9" fontWeight={isSelected ? "700" : "400"}
                    fill={isSelected ? "#ddd" : COLORS.dim}
                    fontFamily="'JetBrains Mono', monospace"
                    style={{ transform: `rotate(${textRotation}deg)`, transformOrigin: `${innerX}px ${innerY}px` }}>{entry.minor}</text>
                </g>
              );
            })}
          </g>
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
