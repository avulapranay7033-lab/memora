import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/Toast";
import "./AnswerQuiz.css";

function AnswerQuiz({ quiz, onSubmit, onBack }) {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (quiz) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(new Array(quiz.questions.length).fill(""));
    }
  }, [quiz]);

  if (!quiz) {
    return (
      <div className="answer-page">
        <motion.div
          className="answer-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>😕 Quiz Not Found</h2>
          <p>This quiz link is invalid or expired.</p>
          <button onClick={onBack}>← Go Home</button>
        </motion.div>
      </div>
    );
  }

  // Name entry screen
  if (!started) {
    return (
      <div className="answer-page">
        <motion.div
          className="answer-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="quiz-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            Quiz Challenge!
          </motion.div>
          <h1>💙 {quiz.title}</h1>
          <p className="creator-info">
            Created by <strong>{quiz.creatorName}</strong>
          </p>
          <p className="q-count">
            {quiz.questions.length} questions waiting for you!
          </p>

          <div className="name-input-section">
            <label>What's your name?</label>
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  setStarted(true);
                  setQuizStartTime(Date.now());
                }
              }}
            />
            <motion.button
              onClick={() => {
                if (name.trim()) {
                  setStarted(true);
                  setQuizStartTime(Date.now());
                } else {
                  showToast("Please enter your name 😊", "warning");
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Answering →
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const total = quiz.questions.length;

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      showToast("Please answer this question 😊", "warning");
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQ] = currentAnswer;
    setAnswers(newAnswers);

    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1);
      setCurrentAnswer(newAnswers[currentQ + 1] || "");
    } else {
      const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
      setSubmitting(true);

      const answerDetails = quiz.questions.map((q, i) => ({
        question: q.question,
        answer: i === currentQ ? currentAnswer : newAnswers[i],
      }));

      onSubmit({
        quizId: quiz.id,
        respondentName: name,
        answers: answerDetails,
        timeTaken: totalTime,
      });
    }
  };

  const questionVariants = {
    enter: { opacity: 0, x: 60, scale: 0.95 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -60, scale: 0.95 },
  };

  return (
    <div className="answer-page">
      <AnimatePresence mode="wait">
        <motion.div
          className="answer-card"
          key={currentQ}
          variants={questionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <div className="progress-header">
            <span>
              Question {currentQ + 1} / {total}
            </span>
            <span className="respondent-name">👤 {name}</span>
          </div>

          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQ + 1) / total) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <h2 className="question-text">{question.question}</h2>

          <div className="answer-input">
            {question.type === "text" && (
              <input
                type="text"
                placeholder="Type your answer..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
                autoFocus
              />
            )}

            {question.type === "textarea" && (
              <textarea
                rows={5}
                placeholder="Write here..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                autoFocus
              />
            )}

            {question.type === "mcq" && (
              <div className="mcq-options">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    className={`mcq-option ${currentAnswer === opt ? "selected" : ""}`}
                    onClick={() => setCurrentAnswer(opt)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <motion.button
            className="next-btn"
            onClick={handleNext}
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting
              ? "Submitting..."
              : currentQ < total - 1
                ? "Next →"
                : "Submit ✓"}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AnswerQuiz;
