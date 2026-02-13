import { useState } from "react";
import { COLORS } from "./utils/musicConstants.js";
import ChordsTab from "./components/tabs/ChordsTab.jsx";
import ScalesTab from "./components/tabs/ScalesTab.jsx";
import CircleOfFifthsTab from "./components/tabs/CircleOfFifthsTab.jsx";
import ProgressionsTab from "./components/tabs/ProgressionsTab.jsx";
import GroovesTab from "./components/tabs/GroovesTab.jsx";
import TimeSignaturesTab from "./components/tabs/TimeSignaturesTab.jsx";
import TempoTab from "./components/tabs/TempoTab.jsx";
import FrequenciesTab from "./components/tabs/FrequenciesTab.jsx";
import IntervalsTab from "./components/tabs/IntervalsTab.jsx";

const TAB_GROUPS = [
  { label: "Theory", tabs: [
    { key: "chords", label: "Chords", component: ChordsTab },
    { key: "scales", label: "Scales", component: ScalesTab },
    { key: "circle", label: "Circle of 5ths", component: CircleOfFifthsTab },
    { key: "progressions", label: "Progressions", component: ProgressionsTab },
  ]},
  { label: "Rhythm", tabs: [
    { key: "grooves", label: "Grooves", component: GroovesTab },
    { key: "timesigs", label: "Time Signatures", component: TimeSignaturesTab },
  ]},
  { label: "Reference", tabs: [
    { key: "tempo", label: "Tempo", component: TempoTab },
    { key: "frequencies", label: "Frequencies", component: FrequenciesTab },
    { key: "intervals", label: "Intervals", component: IntervalsTab },
  ]},
];

const ALL_TABS = TAB_GROUPS.flatMap(g => g.tabs);

export default function App() {
  const [activeTab, setActiveTab] = useState("chords");
  const ActiveComponent = ALL_TABS.find(t => t.key === activeTab).component;

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text,
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px",
    }}>
      {/* Grouped tab bar */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
        {TAB_GROUPS.map((group, gi) => (
          <div key={group.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              fontSize: "9px", color: COLORS.dimmer, letterSpacing: "2px",
              textTransform: "uppercase", fontWeight: 600,
            }}>{group.label}</div>
            <div style={{ display: "flex", gap: "3px" }}>
              {group.tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  padding: "7px 12px", fontSize: "12px",
                  fontWeight: activeTab === tab.key ? 700 : 400,
                  background: activeTab === tab.key ? COLORS.accent : COLORS.surfaceDark,
                  color: activeTab === tab.key ? "#fff" : COLORS.muted,
                  border: "1px solid " + (activeTab === tab.key ? COLORS.accent : COLORS.borderDark),
                  borderRadius: "5px", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}>{tab.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
}
