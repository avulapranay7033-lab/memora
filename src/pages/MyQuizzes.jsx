import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllQuizzes, getResponsesForQuiz, isSupabaseReady, supabase, saveQuiz } from "../supabase";
import { showToast } from "../components/Toast";
import ShareModal from "../components/ShareModal";
import "./MyQuizzes.css";

function MyQuizzes({ onBack, onOpenDashboard, onEditQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseCounts, setResponseCounts] = useState({});
  const [shareQuiz, setShareQuiz] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadQuizzes = async () => {
    setLoading(true);
    const data = await getAllQuizzes();
    setQuizzes(data);

    const counts = {};
    for (const quiz of data) {
      const responses = await getResponsesForQuiz(quiz.id);
      counts[quiz.id] = responses.length;
    }
    setResponseCounts(counts);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQuizzes();
  }, []);

  const handleDelete = async (quiz) => {
    try {
      if (isSupabaseReady && supabase) {
        // Delete responses first, then quiz
        await supabase.from("responses").delete().eq("quiz_id", quiz.id);
        await supabase.from("quizzes").delete().eq("id", quiz.id);
      } else {
        // localStorage fallback
        const quizzes = JSON.parse(localStorage.getItem("memora_quizzes") || "[]");
        const responses = JSON.parse(localStorage.getItem("memora_responses") || "[]");
        localStorage.setItem(
          "memora_quizzes",
          JSON.stringify(quizzes.filter((q) => q.id !== quiz.id))
        );
        localStorage.setItem(
          "memora_responses",
          JSON.stringify(responses.filter((r) => r.quiz_id !== quiz.id))
        );
      }

      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      setDeleteConfirm(null);
      showToast("Quiz deleted! 🗑️", "success");
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete quiz", "error");
    }
  };

  const handleDuplicate = async (quiz) => {
    try {
      await saveQuiz({
        creatorName: quiz.creatorName,
        title: `${quiz.title} (Copy)`,
        questions: quiz.questions,
      });
      await loadQuizzes();
      showToast("Quiz duplicated! 📋", "success");
    } catch (error) {
      console.error("Duplicate failed:", error);
      showToast("Failed to duplicate quiz", "error");
    }
  };

  if (loading) {
    return (
      <div className="myquizzes-page">
        <div className="mq-loading">
          <div className="spinner" />
          <p>Loading your quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myquizzes-page">
      <div className="mq-container">
        <motion.button
          className="back-btn"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Back
        </motion.button>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          📊 My Quizzes
        </motion.h1>
        <motion.p
          className="mq-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Manage your created quizzes
        </motion.p>

        {quizzes.length === 0 ? (
          <motion.div
            className="mq-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="empty-icon">📝</div>
            <p>No quizzes yet!</p>
            <p className="empty-sub">Create your first quiz from the home page.</p>
          </motion.div>
        ) : (
          <div className="mq-list">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                className="mq-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                whileHover={{ borderColor: "rgba(59,130,246,0.4)" }}
              >
                <div className="mq-card-header">
                  <h3>{quiz.title}</h3>
                  <span className="mq-code">{quiz.shareCode}</span>
                </div>
                <div className="mq-card-meta">
                  <span>📝 {quiz.questions.length} questions</span>
                  <span>👥 {responseCounts[quiz.id] || 0} responses</span>
                </div>
                <div className="mq-card-actions">
                  <motion.button
                    className="mq-action-btn dashboard"
                    onClick={() => onOpenDashboard(quiz.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📊 Dashboard
                  </motion.button>
                  <motion.button
                    className="mq-action-btn share"
                    onClick={() => setShareQuiz(quiz)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🔗 Share
                  </motion.button>
                  <motion.button
                    className="mq-action-btn edit"
                    onClick={() => onEditQuiz(quiz)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Edit"
                  >
                    ✏️
                  </motion.button>
                  <motion.button
                    className="mq-action-btn duplicate"
                    onClick={() => handleDuplicate(quiz)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Duplicate"
                  >
                    📋
                  </motion.button>
                  <motion.button
                    className="mq-action-btn delete"
                    onClick={() => setDeleteConfirm(quiz)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Delete"
                  >
                    🗑️
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareQuiz && <ShareModal quiz={shareQuiz} onClose={() => setShareQuiz(null)} />}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="delete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="delete-modal"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>🗑️ Delete Quiz?</h3>
              <p>
                Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>?
                This cannot be undone.
              </p>
              <div className="delete-actions">
                <button className="delete-cancel" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
                <button className="delete-confirm" onClick={() => handleDelete(deleteConfirm)}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyQuizzes;
