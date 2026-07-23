import { motion } from "framer-motion";
import { useState } from "react";
import Confetti from "react-confetti";
import { showToast } from "../components/Toast";
import { downloadCertificate } from "../utils/certificateV2";
import "./Result.css";

function Result({ response, quiz, onBack }) {
  const [downloading, setDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [gender, setGender] = useState("");

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

  const calculateScore = () => {
    if (!quiz.creator_answers || quiz.creator_answers.length === 0) {
      return { correct: 0, total: quiz.questions.length, percentage: 0 };
    }

    let correct = 0;
    response.answers.forEach((answer, index) => {
      const creatorAnswer = quiz.creator_answers[index];
      if (creatorAnswer && answer.answer) {
        if (quiz.questions[index].type === "mcq") {
          if (answer.answer.toLowerCase().trim() === creatorAnswer.toLowerCase().trim()) {
            correct++;
          }
        } else {
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
    if (!gender) {
      showToast("Please select Mr or Miss first! 😊", "warning");
      return;
    }
    
    setDownloading(true);
    const success = await downloadCertificate(
      quiz,
      score,
      response.respondentName,
      gender
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

        <div className="gender-selection">
          <label>Select title for certificate:</label>
          <div className="gender-buttons">
            <button
              className={`gender-btn ${gender === "mr" ? "selected" : ""}`}
              onClick={() => setGender("mr")}
            >
              Mr
            </button>
            <button
              className={`gender-btn ${gender === "miss" ? "selected" : ""}`}
              onClick={() => setGender("miss")}
            >
              Miss
            </button>
          </div>
        </div>

        <div className="result-actions">
          <motion.button
            className="download-btn"
            onClick={handleDownload}
            disabled={downloading || !gender}
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