import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Confetti from "react-confetti";
import { showToast } from "../components/Toast";
import { downloadCertificate } from "../utils/certificate";
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

  // Calculate score by comparing with creator's answers
  const calculateScore = () => {
    if (!quiz.creator_answers || quiz.creator_answers.length === 0) {
      return { correct: 0, total: quiz.questions.length, percentage: 0 };
    }

    let correct = 0;
    response.answers.forEach((answer, index) => {
      const creatorAnswer = quiz.creator_answers[index];
      if (creatorAnswer && answer.answer) {
        // For MCQ: exact match
        if (quiz.questions[index].type === "mcq") {
          if (answer.answer.toLowerCase().trim() === creatorAnswer.toLowerCase().trim()) {
            correct++;
          }
        } else {
          // For text/textarea: partial match (if answer contains key words)
          const answerWords = answer.answer.toLowerCase().trim().split(/\s+/);
          const creatorWords = creatorAnswer.toLowerCase().trim().split(/\s+/);
          const matchCount = answerWords.filter(word => creatorWords.includes(word)).length;
          if (matchCount / creatorWords.length >= 0.5) {
            correct++;
          }
        }
      }
    });

    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  const score = calculateScore();

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
    const text = `🎉 I scored ${score.percentage}% on "${quiz.title}" memory challenge!\n\nCreated by ${quiz.creatorName} 💙\n\nTry it yourself: ${window.location.origin}${window.location.pathname}#/quiz/${quiz.shareCode}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleShareTwitter = () => {
    const text = `I scored ${score.percentage}% on "${quiz.title}" memory challenge! 💙🎉`;
    const url = `${window.location.origin}${window.location.pathname}#/quiz/${quiz.shareCode}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const getScoreMessage = () => {
    if (score.percentage >= 90) return "Amazing! You know them so well! 🌟";
    if (score.percentage >= 70) return "Great job! Strong friendship! 💪";
    if (score.percentage >= 50) return "Good effort! Keep making memories! 😊";
    return "Time to make more memories together! 💙";
  };

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

      {/* Certificate template (visible for download) */}
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
              has completed the memory challenge
            </p>
            <h3 className="cert-quiz-title">"{quiz.title}"</h3>
            <p className="cert-creator">created by {quiz.creatorName}</p>
            
            <div className="cert-score-section">
              <div className="cert-score-big">{score.percentage}%</div>
              <div className="cert-score-label">Score</div>
              <div className="cert-score-detail">
                {score.correct} out of {score.total} correct
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

        {/* Score Display */}
        <motion.div
          className="score-display"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="score-circle">
            <div className="score-number">{score.percentage}%</div>
            <div className="score-label">Score</div>
          </div>
          <p className="score-message">{getScoreMessage()}</p>
          <p className="score-detail">
            {score.correct} out of {score.total} answers matched
          </p>
        </motion.div>

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