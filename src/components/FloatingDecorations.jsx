import { useMemo } from "react";
import "./FloatingDecorations.css";

const FLOWER_SETS = {
  flowers: ["🌸", "🌺", "🌷", "🌼", "🌻", "💐", "🪻", "🌹"],
  nature: ["🍃", "🌿", "🍀", "🌱", "🪴", "🌾"],
  sparkle: ["✨", "💫", "⭐", "🌟"],
  butterflies: ["🦋", "🐝"],
};

// Pre-computed positions (deterministic, no Math.random in render)
const POSITIONS = [
  { top: 8, left: 5, size: 28, delay: 0, duration: 10, opacity: 0.4 },
  { top: 15, left: 88, size: 24, delay: 1.2, duration: 12, opacity: 0.35 },
  { top: 42, left: 3, size: 30, delay: 2.5, duration: 9, opacity: 0.45 },
  { top: 68, left: 92, size: 26, delay: 0.8, duration: 11, opacity: 0.4 },
  { top: 22, left: 25, size: 20, delay: 3.1, duration: 8, opacity: 0.3 },
  { top: 82, left: 12, size: 32, delay: 1.7, duration: 13, opacity: 0.38 },
  { top: 75, left: 82, size: 22, delay: 4.2, duration: 10, opacity: 0.35 },
  { top: 35, left: 95, size: 20, delay: 0.5, duration: 14, opacity: 0.3 },
  { top: 90, left: 45, size: 28, delay: 2.8, duration: 11, opacity: 0.35 },
  { top: 55, left: 75, size: 22, delay: 3.5, duration: 9, opacity: 0.3 },
  { top: 5, left: 55, size: 24, delay: 1.0, duration: 12, opacity: 0.35 },
  { top: 60, left: 8, size: 20, delay: 4.0, duration: 10, opacity: 0.28 },
];

function FloatingDecorations({ variant = "mixed", count = 10 }) {
  const items = useMemo(() => {
    if (variant === "mixed") {
      return [
        ...FLOWER_SETS.flowers.slice(0, 4),
        ...FLOWER_SETS.nature.slice(0, 2),
        ...FLOWER_SETS.sparkle.slice(0, 2),
        ...FLOWER_SETS.butterflies.slice(0, 1),
      ];
    } else if (variant === "flowers") {
      return [...FLOWER_SETS.flowers];
    } else if (variant === "celebration") {
      return ["🎉", "🎊", "✨", "💫", "🏆", "💙", "🎯", "⭐"];
    }
    return [...FLOWER_SETS.flowers];
  }, [variant]);

  const decorations = useMemo(() => {
    const result = [];
    const n = Math.min(count, items.length, POSITIONS.length);
    for (let i = 0; i < n; i++) {
      const pos = POSITIONS[i];
      result.push({
        emoji: items[i % items.length],
        ...pos,
      });
    }
    return result;
  }, [items, count]);

  return (
    <div className="floating-decorations-wrapper">
      {decorations.map((d, i) => (
        <span
          key={i}
          className="fd-item"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            fontSize: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}

export default FloatingDecorations;
