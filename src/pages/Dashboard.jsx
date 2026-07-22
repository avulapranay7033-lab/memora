import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getQuizById, getResponsesForQuiz } from "../supabase";
import { showToast } from "../components/Toast";
import { exportResponsesCSV } from "../utils/csvExport";
import ShareModal from "../components/ShareModal";
import "./Dashboard.css";

const CHART_COLORS = ["#3b82f6", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

function Dashboard({ quizId, onBack }) {
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [activeTab, setActiveTab] = useState("responses");

  const loadData = async () => {
    setLoading(true);
    const quizData = await getQuizById(quizId);
    const responseData = await getResponsesForQuiz(quizId);
    setQuiz(quizData);
    setResponses(responseData);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [quizId]);

  const copyShareLink = () => {
    if (!quiz) return;
    const link = `${window.location.origin}${window.location.pathname}#/quiz/${quiz.shareCode}`;
    navigator.clipboard.writeText(link).then(() => {
      showToast("Link copied! 📋", "success");
    });
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Calculate MCQ analytics
  const getMcqAnalytics = () => {
    if (!quiz || responses.length === 0) return [];

    const analytics = [];
    quiz.questions.forEach((q, qIndex) => {
      if (q.type !== "mcq") return;

      const counts = {};
      q.options.forEach((opt) => { counts[opt] = 0; });

      responses.forEach((resp) => {
        const answer = resp.answers[qIndex]?.answer;
        if (answer && Object.prototype.hasOwnProperty.call(counts, answer)) {
          counts[answer]++;
        }
      });

      analytics.push({
        question: q.question,
        questionIndex: qIndex,
        data: Object.entries(counts).map(([name, value]) => ({ name, value })),
      });
    });

    return analytics;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dash-loading">
          <div className="spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="dashboard-page">
        <div className="dash-card">
          <h2>Quiz not found 😕</h2>
          <button onClick={onBack}>← Go Back</button>
        </div>
      </div>
    );
  }

  const mcqAnalytics = getMcqAnalytics();

  // Response detail view
  if (selectedResponse) {
    return (
      <div className="dashboard-page">
        <div className="dash-container">
          <motion.button
            className="back-btn"
            onClick={() => setSelectedResponse(null)}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            ← Back to Dashboard
          </motion.button>

          <motion.div
            className="response-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>💙 {selectedResponse.respondentName}'s Answers</h1>
            <p className="response-meta">
              ⏱️ Completed in {formatTime(selectedResponse.time_taken || selectedResponse.timeTaken)}
            </p>

            <div className="answers-list">
              {selectedResponse.answers.map((item, i) => (
                <motion.div
                  key={i}
                  className="answer-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="answer-q">
                    <span className="answer-num">Q{i + 1}</span>
                    {item.question}
                  </div>
                  <div className="answer-a">{item.answer || "—"}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dash-container">
        <motion.button
          className="back-btn"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Back
        </motion.button>

        <motion.div
          className="dash-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>📊 Dashboard</h1>
            <h2>{quiz.title}</h2>
            <p className="dash-creator">
              by {quiz.creatorName} • {quiz.questions.length} questions
            </p>
          </div>
        </motion.div>

        {/* Share actions */}
        <motion.div
          className="share-actions-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="share-code-display">
            <span>Code: </span>
            <strong>{quiz.shareCode}</strong>
          </div>
          <div className="share-btns">
            <motion.button
              className="share-btn copy-btn"
              onClick={() => setShowShare(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              🔗 Share
            </motion.button>
            <motion.button
              className="share-btn whatsapp-btn"
              onClick={copyShareLink}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              📋 Copy
            </motion.button>
            {responses.length > 0 && (
              <motion.button
                className="share-btn export-btn"
                onClick={() => {
                  exportResponsesCSV(quiz, responses);
                  showToast("CSV downloaded! 📊", "success");
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                📥 CSV
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="stats-row"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-card">
            <motion.div className="stat-number"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              {responses.length}
            </motion.div>
            <div className="stat-label">Responses</div>
          </div>
          <div className="stat-card">
            <motion.div className="stat-number"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {quiz.questions.length}
            </motion.div>
            <div className="stat-label">Questions</div>
          </div>
          <div className="stat-card">
            <motion.div className="stat-number"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              {responses.length > 0
                ? formatTime(
                    Math.round(
                      responses.reduce((sum, r) => sum + (r.time_taken || r.timeTaken || 0), 0) /
                        responses.length
                    )
                  )
                : "--"}
            </motion.div>
            <div className="stat-label">Avg Time</div>
          </div>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          className="dash-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className={`dash-tab ${activeTab === "responses" ? "active" : ""}`}
            onClick={() => setActiveTab("responses")}
          >
            👥 Responses ({responses.length})
          </button>
          {mcqAnalytics.length > 0 && (
            <button
              className={`dash-tab ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              📈 Analytics
            </button>
          )}
          {responses.length > 1 && (
            <button
              className={`dash-tab ${activeTab === "leaderboard" ? "active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
            >
              🏆 Leaderboard
            </button>
          )}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "responses" ? (
            <motion.div
              key="responses"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {responses.length === 0 ? (
                <div className="empty-state">
                  <p>No responses yet! 😅</p>
                  <p>Share the link with your friends to get responses.</p>
                </div>
              ) : (
                <div className="responses-grid">
                  {responses.map((resp, index) => (
                    <motion.div
                      key={resp.id}
                      className="response-card"
                      onClick={() => setSelectedResponse(resp)}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + index * 0.06 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="resp-avatar">
                        {resp.respondentName.charAt(0).toUpperCase()}
                      </div>
                      <div className="resp-info">
                        <div className="resp-name">{resp.respondentName}</div>
                        <div className="resp-time">
                          ⏱️ {formatTime(resp.time_taken || resp.timeTaken)} •{" "}
                          {new Date(resp.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="resp-arrow">→</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeTab === "leaderboard" ? (
            <motion.div
              key="leaderboard"
              className="leaderboard-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="leaderboard-title">⏱️ Fastest Responders</h3>
              <div className="leaderboard-list">
                {[...responses]
                  .sort((a, b) => (a.time_taken || a.timeTaken) - (b.time_taken || b.timeTaken))
                  .map((resp, rank) => (
                    <motion.div
                      key={resp.id}
                      className={`lb-row ${rank < 3 ? `lb-rank-${rank}` : ""}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rank * 0.08 }}
                    >
                      <div className="lb-medal">
                        {rank === 0 && "🥇"}
                        {rank === 1 && "🥈"}
                        {rank === 2 && "🥉"}
                        {rank > 2 && `#${rank + 1}`}
                      </div>
                      <div className="lb-info">
                        <div className="lb-name">{resp.respondentName}</div>
                        <div className="lb-time">
                          {formatTime(resp.time_taken || resp.timeTaken)}
                        </div>
                      </div>
                      <div className="lb-answered">
                        {resp.answers.filter((a) => a.answer && a.answer.trim()).length}/{quiz.questions.length}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              className="analytics-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {mcqAnalytics.map((item, aIndex) => (
                <motion.div
                  key={aIndex}
                  className="chart-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: aIndex * 0.1 }}
                >
                  <h3 className="chart-question">{item.question}</h3>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={item.data} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(30,27,58,0.95)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 10,
                            color: "white",
                            fontSize: 13,
                          }}
                          cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                          {item.data.map((_, index) => (
                            <Cell
                              key={index}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-total">
                    {item.data.reduce((sum, d) => sum + d.value, 0)} responses
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && <ShareModal quiz={quiz} onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
