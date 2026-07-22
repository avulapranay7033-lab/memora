import { motion } from "framer-motion";
import "./ColorThemePicker.css";

const THEMES = [
  { id: "blue-purple", colors: ["#3b82f6", "#7c3aed"], name: "Ocean" },
  { id: "pink-orange", colors: ["#ec4899", "#f97316"], name: "Sunset" },
  { id: "green-teal", colors: ["#10b981", "#06b6d4"], name: "Forest" },
  { id: "red-pink", colors: ["#ef4444", "#ec4899"], name: "Love" },
  { id: "amber-yellow", colors: ["#f59e0b", "#eab308"], name: "Gold" },
  { id: "indigo-blue", colors: ["#6366f1", "#3b82f6"], name: "Galaxy" },
  { id: "rose-violet", colors: ["#f43f5e", "#8b5cf6"], name: "Berry" },
  { id: "emerald-lime", colors: ["#10b981", "#84cc16"], name: "Nature" },
];

function ColorThemePicker({ selected, onChange }) {
  return (
    <div className="theme-picker">
      <label className="theme-label">🎨 Quiz Theme</label>
      <div className="theme-grid">
        {THEMES.map((theme) => (
          <motion.button
            key={theme.id}
            className={`theme-swatch ${selected === theme.id ? "selected" : ""}`}
            style={{
              background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
            }}
            onClick={() => onChange(theme)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            title={theme.name}
          >
            {selected === theme.id && <span className="theme-check">✓</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export { THEMES };
export default ColorThemePicker;
