import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/Toast";
import Typewriter from "../components/Typewriter";
import "./Welcome.css";

function Welcome({ onCreateQuiz, onJoinQuiz, onMyQuizzes }) {
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const handleJoin = () => {
    if (!joinCode.trim()) {
      showToast("Please enter a quiz code 😊", "warning");
      return;
    }
    onJoinQuiz(joinCode.trim().toUpperCase());
  };

  return (
    <div className="welcome">
      {/* Animated background */}
      <div className="welcome-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="grid-overlay" />
      </div>

      {/* Floating decorative flowers */}
      <div className="floating-decorations">
        <span className="deco deco-1">🌸</span>
        <span className="deco deco-2">🦋</span>
        <span className="deco deco-3">💐</span>
        <span className="deco deco-4">🌺</span>
        <span className="deco deco-5">✨</span>
        <span className="deco deco-6">🌷</span>
        <span className="deco deco-7">🌼</span>
        <span className="deco deco-8">💫</span>
        <span className="deco deco-9">🌻</span>
        <span className="deco deco-10">🍃</span>
        <span className="deco deco-11">🪻</span>
        <span className="deco deco-12">🌿</span>
      </div>

      {/* Main card */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Decorative corner flowers */}
        <div className="card-deco card-deco-tl">🌸</div>
        <div className="card-deco card-deco-tr">🌺</div>
        <div className="card-deco card-deco-bl">🌷</div>
        <div className="card-deco card-deco-br">🌼</div>

        <motion.div
          className="brand-badge"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          🌸 MEMORY CHALLENGE 🌸
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Memora
        </motion.h1>

        <motion.h2
          className="typewriter-heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <Typewriter
            texts={[
              "Best Friend Quiz 💙",
              "Memory Challenge 🧠",
              "Test Your Bond 🤝",
              "How Well You Know Me? 👀",
              "Friendship Certificate 🏆",
            ]}
            speed={70}
            pause={2500}
          />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Create your own quiz and share with friends!
          <br />
          See how well they remember your memories.
        </motion.p>

        <motion.div
          className="feature-pills"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="pill">🎯 Custom Questions</span>
          <span className="pill">🏆 Certificates</span>
          <span className="pill">📊 Analytics</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showJoin ? (
            <motion.div
              className="welcome-actions"
              key="main-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.65, duration: 0.3 }}
            >
              <motion.button
                className="primary-btn"
                onClick={onCreateQuiz}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                ✨ Create Quiz
              </motion.button>

              <motion.button
                className="secondary-btn"
                onClick={() => setShowJoin(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                🔗 Join with Code
              </motion.button>

              <motion.button
                className="link-btn"
                onClick={onMyQuizzes}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                📊 My Quizzes
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              className="join-section"
              key="join-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Enter 6-digit code..."
                value={joinCode}
                maxLength={6}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                autoFocus
              />
              <motion.button
                className="primary-btn"
                onClick={handleJoin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join →
              </motion.button>
              <button className="link-btn" onClick={() => setShowJoin(false)}>
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="welcome-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Made with 💙 • Memora 2026
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Welcome;
