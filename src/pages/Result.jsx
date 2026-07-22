import { useRef, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { downloadCertificate } from "../utils/certificate";
import { showToast } from "../components/Toast";
import "./Result.css";

function Result({ response, quiz, onBack }) {
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  if (!response || !quiz) {
    return (
      <div className="result-page">
        <div className="result-card">
          <h2>Something went wrong 😕</h2>
          <button onClick={onBack}>← Go Home</button>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    const success = await downloadCertificate(
      certRef.current,
      `memora-${response.respondentName}.png`
    );
    setDownloading(false);
    if (success) {
      showToast("Certificate downloaded! 📥", "success");
    } else {
      showToast("Download failed. Please try again.", "error");
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🎉 I just completed the "${quiz.title}" memory challenge on Memora!\n\nCreated by ${quiz.creatorName} 💙\n\nTry it yourself: ${window.location.origin}${window.location.pathname}#/quiz/${quiz.shareCode}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleShareTwitter = () => {
    const text = `I just completed the "${quiz.title}" memory challenge on Memora! 💙🎉`;
    const url = `${window.location.origin}${window.location.pathname}#/quiz/${quiz.shareCode}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const answeredCount = response.answers.filter(
    (a) => a.answer && a.answer.trim()
  ).length;

  return (
    <div className="result-page">
      {/* Confetti celebration */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
          colors={["#3b82f6", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#ffd700"]}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      {/* Hidden certificate template for download */}
      <div ref={certRef} className="certificate-template">
        <div className="cert-border">
          <div className="cert-decoration top-left" />
          <div className="cert-decoration top-right" />
          <div className="cert-decoration bottom-left" />
          <div className="cert-decoration bottom-right" />

          <div className="cert-content">
            <div className="cert-logo">💙</div>
            <h1 className="cert-title">CERTIFICATE OF FRIENDSHIP</h1>
            <div className="cert-divider" />
            <p className="cert-subtitle">This certifies that</p>
            <h2 className="cert-name">{response.respondentName}</h2>
            <p className="cert-desc">
              has successfully completed the memory challenge
            </p>
            <h3 className="cert-quiz-title">"{quiz.title}"</h3>
            <p className="cert-creator">created by {quiz.creatorName}</p>
            <div className="cert-stats">
              <div className="cert-stat">
                <span className="cert-stat-num">
                  {answeredCount}/{quiz.questions.length}
                </span>
                <span className="cert-stat-label">Questions Answered</span>
              </div>
              <div className="cert-stat-divider" />
              <div className="cert-stat">
                <span className="cert-stat-num">
                  {formatTime(
                    response.timeTaken || response.time_taken
                  )}
                </span>
                <span className="cert-stat-label">Time Taken</span>
              </div>
            </div>
            <div className="cert-footer">
              <div className="cert-date">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="cert-brand">Memora 💙</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visible result screen */}
      <motion.div
        className="result-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
      >
        <motion.div
          className="result-confetti"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          🎉
        </motion.div>
        <h1>Completed!</h1>
        <h2>Great job, {response.respondentName}! 💙</h2>

        <div className="result-stats">
          <motion.div
            className="r-stat"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="r-stat-icon">📝</div>
            <div className="r-stat-num">
              {answeredCount}/{quiz.questions.length}
            </div>
            <div className="r-stat-label">Answered</div>
          </motion.div>
          <motion.div
            className="r-stat"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <div className="r-stat-icon">⏱️</div>
            <div className="r-stat-num">
              {formatTime(response.timeTaken || response.time_taken)}
            </div>
            <div className="r-stat-label">Time Taken</div>
          </motion.div>
        </div>

        <div className="result-actions">
          <motion.button
            className="download-btn"
            onClick={handleDownload}
            disabled={downloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {downloading ? "⏳ Generating..." : "📥 Download Certificate"}
          </motion.button>

          <div className="share-buttons">
            <motion.button
              className="share-whatsapp"
              onClick={handleShareWhatsApp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              💬 WhatsApp
            </motion.button>
            <motion.button
              className="share-twitter"
              onClick={handleShareTwitter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🐦 Twitter
            </motion.button>
          </div>

          <motion.button
            className="home-btn"
            onClick={onBack}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Result;
