import { motion } from "framer-motion";
import { useState } from "react";
import "./CreatorAnswer.css";

function CreatorAnswer({ quiz, onSubmit, onBack }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  if (!quiz) return null;

  const question = quiz.questions[currentQ];
  const total = quiz.questions.length;

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      alert("Please answer this question 😊");
      return;
    }

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1);
      setCurrentAnswer("");
    } else {
      // Submit creator answers
      onSubmit(newAnswers);
    }
  };

  return (
    <div className="creator-answer-page">
      <motion.div
        className="creator-answer-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="creator-header">
          <h2>🎯 Answer Your Own Quiz</h2>
          <p>Set the "correct" answers so friends can be scored!</p>
        </div>

        <div className="progress-header">
          <span>
            Question {currentQ + 1} / {total}
          </span>
        </div>

        <div className="progress-bar-container">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <h3 className="question-text">{question.question}</h3>

        <div className="answer-input">
          {question.type === "text" && (
            <input
              type="text"
              placeholder="Your answer..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              autoFocus
            />
          )}

          {question.type === "textarea" && (
            <textarea
              rows={4}
              placeholder="Your answer..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              autoFocus
            />
          )}

          {question.type === "mcq" && (
            <div className="mcq-options">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  className={`mcq-option ${currentAnswer === opt ? "selected" : ""}`}
                  onClick={() => setCurrentAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="next-btn" onClick={handleNext}>
          {currentQ < total - 1 ? "Next →" : "Finish & Get Share Link ✓"}
        </button>

        <button className="back-link" onClick={onBack}>
          ← Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default CreatorAnswer;