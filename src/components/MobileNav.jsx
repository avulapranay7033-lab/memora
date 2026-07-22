import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./MobileNav.css";

function MobileNav({ currentPage, onNavigate }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setVisible(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!visible) return null;

  const navItems = [
    { id: "welcome", icon: "🏠", label: "Home", path: "/" },
    { id: "create", icon: "✨", label: "Create", path: "/templates" },
    { id: "myquizzes", icon: "📊", label: "My Quizzes", path: "/my-quizzes" },
  ];

  return (
    <motion.nav
      className="mobile-nav"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${currentPage === item.id ? "active" : ""}`}
          onClick={() => onNavigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
          {currentPage === item.id && (
            <motion.div
              className="nav-indicator"
              layoutId="nav-indicator"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </motion.nav>
  );
}

export default MobileNav;
