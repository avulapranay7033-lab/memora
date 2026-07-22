import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { showToast } from "../components/Toast";
import ColorThemePicker, { THEMES } from "../components/ColorThemePicker";
import "./CreateQuiz.css";

const QUESTION_TYPES = [
  { value: "text", label: "✏️ Short Text" },
  { value: "textarea", label: "📝 Long Text" },
  { value: "mcq", label: "🔘 Multiple Choice" },
];

function CreateQuiz({ onCreateQuiz, onBack, template = null }) {
  const [creatorName, setCreatorName] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [questions, setQuestions] = useState([
    { id: 1, question: "", type: "text", options: [] },
  ]);

  // Load template if provided
  useEffect(() => {
    if (template && template.questions) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuizTitle(template.name);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuestions(
        template.questions.map((q, i) => ({
          id: i + 1,
          question: q.question,
          type: q.type,
          options: q.options || [],
        }))
      );
    }
  }, [template]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        type: "text",
        options: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    if (field === "type" && value === "mcq" && updated[index].options.length === 0) {
      updated[index].options = ["", "", "", ""];
    }
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length < 6) {
      updated[qIndex].options.push("");
      setQuestions(updated);
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(oIndex, 1);
      setQuestions(updated);
    }
  };

  const handleCreate = () => {
    if (!creatorName.trim()) {
      showToast("Please enter your name 😊", "warning");
      return;
    }
    if (!quizTitle.trim()) {
      showToast("Please enter a quiz title 😊", "warning");
      return;
    }

    const validQuestions = questions.filter((q) => {
      if (!q.question.trim()) return false;
      if (q.type === "mcq" && q.options.filter((o) => o.trim()).length < 2) return false;
      return true;
    });

    if (validQuestions.length === 0) {
      showToast("Add at least one valid question 😊", "warning");
      return;
    }

    const cleaned = validQuestions.map((q) => ({
      ...q,
      options: q.type === "mcq" ? q.options.filter((o) => o.trim()) : [],
    }));

    onCreateQuiz({
      creatorName,
      title: quizTitle,
      questions: cleaned,
      theme: selectedTheme,
    });
  };

  return (
    <div className="create-quiz-page">
      <div className="create-quiz-container">
        <motion.button
          className="back-btn"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Back
        </motion.button>

        <h1>
          {template ? `${template.icon} Edit Template` : "💙 Create Your Quiz"}
        </h1>
        <p className="subtitle">
          {template
            ? "Customize the template questions or add your own!"
            : "Create your own questions and share with your bestie!"}
        </p>

        <div className="creator-section">
          <div className="input-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name..."
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Quiz Title</label>
            <input
              type="text"
              placeholder="e.g., Mana Friendship Quiz 💙"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </div>
        </div>

        <ColorThemePicker selected={selectedTheme.id} onChange={setSelectedTheme} />

        <div className="questions-section">
          <h2>📋 Questions ({questions.length})</h2>

          {questions.map((q, qIndex) => (
            <motion.div
              key={qIndex}
              className="question-builder"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(qIndex * 0.04, 0.3) }}
            >
              <div className="qb-header">
                <span className="qb-number">Q{qIndex + 1}</span>
                {questions.length > 1 && (
                  <button className="remove-btn" onClick={() => removeQuestion(qIndex)}>
                    ✕
                  </button>
                )}
              </div>

              <input
                type="text"
                className="qb-question"
                placeholder="Type your question here..."
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
              />

              <div className="qb-type-select">
                {QUESTION_TYPES.map((t) => (
                  <button
                    key={t.value}
                    className={`type-btn ${q.type === t.value ? "active" : ""}`}
                    onClick={() => updateQuestion(qIndex, "type", t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {q.type === "mcq" && (
                <div className="qb-options">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="option-row">
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      />
                      {q.options.length > 2 && (
                        <button className="opt-remove" onClick={() => removeOption(qIndex, oIndex)}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 6 && (
                    <button className="add-option" onClick={() => addOption(qIndex)}>
                      + Add Option
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          <button className="add-question-btn" onClick={addQuestion}>
            + Add Question
          </button>
        </div>

        <motion.button
          className="create-btn"
          onClick={handleCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Quiz & Get Link 🚀
        </motion.button>
      </div>
    </div>
  );
}

export default CreateQuiz;
