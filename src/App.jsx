import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getQuizByCode, getQuizById, saveQuiz, saveResponse, updateQuiz } from "./supabase";

// Components
import FloatingDecorations from "./components/FloatingDecorations";
import MobileNav from "./components/MobileNav";
import PageTransition from "./components/PageTransition";
import ParticleBackground from "./components/ParticleBackground";
import TemplateSelector from "./components/TemplateSelector";
import ToastContainer, { showToast } from "./components/Toast";

// Pages
import AnswerQuiz from "./pages/AnswerQuiz";
import CreateQuiz from "./pages/CreateQuiz";
import CreatorAnswer from "./pages/CreatorAnswer";
import Dashboard from "./pages/Dashboard";
import MyQuizzes from "./pages/MyQuizzes";
import Result from "./pages/Result";
import Welcome from "./pages/Welcome";

function App() {
  const [route, setRoute] = useState({ page: "welcome", params: {} });
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [pendingQuiz, setPendingQuiz] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editQuiz, setEditQuiz] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1) || "/";
      const parts = hash.split("/").filter(Boolean);

      if (parts[0] === "quiz" && parts[1]) {
        setRoute({ page: "answer", params: { code: parts[1] } });
      } else if (parts[0] === "create") {
        setRoute({ page: "create", params: {} });
      } else if (parts[0] === "creator-answer") {
        setRoute({ page: "creator-answer", params: {} });
      } else if (parts[0] === "templates") {
        setRoute({ page: "templates", params: {} });
      } else if (parts[0] === "edit" && parts[1]) {
        setRoute({ page: "edit", params: { quizId: parts[1] } });
      } else if (parts[0] === "dashboard" && parts[1]) {
        setRoute({ page: "dashboard", params: { quizId: parts[1] } });
      } else if (parts[0] === "result") {
        setRoute({ page: "result", params: {} });
      } else if (parts[0] === "my-quizzes") {
        setRoute({ page: "myquizzes", params: {} });
      } else {
        setRoute({ page: "welcome", params: {} });
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  const handleCreateQuiz = async (quizData) => {
    setLoading(true);
    try {
      const quiz = await saveQuiz({ ...quizData, creatorAnswers: [] });
      setPendingQuiz(quiz);
      setSelectedTemplate(null);
      setEditQuiz(null);
      navigate("/creator-answer");

      setTimeout(() => {
        showToast(`Quiz created! Now answer your own questions 🎯`, "success");
      }, 500);
    } catch (error) {
      console.error("Failed to create quiz:", error);
      showToast("Failed to create quiz. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleCreatorAnswer = async (creatorAnswers) => {
    if (!pendingQuiz) return;

    setLoading(true);
    try {
      const updatedQuiz = await updateQuiz(pendingQuiz.id, { creatorAnswers });
      setPendingQuiz(null);
      setCurrentQuiz(updatedQuiz);
      navigate(`/dashboard/${updatedQuiz.id}`);

      setTimeout(() => {
        showToast(`Quiz ready! Share code: ${updatedQuiz.shareCode} 🎉`, "success");
      }, 500);
    } catch (error) {
      console.error("Failed to save creator answers:", error);
      showToast("Failed to save answers. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleJoinQuiz = async (code) => {
    setLoading(true);
    try {
      const quiz = await getQuizByCode(code);
      if (quiz) {
        setCurrentQuiz(quiz);
        navigate(`/quiz/${code}`);
      } else {
        showToast("Quiz not found! Check the code 😕", "error");
      }
    } catch (error) {
      console.error("Failed to load quiz:", error);
      showToast("Failed to load quiz. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleSubmitResponse = async (responseData) => {
    try {
      const response = await saveResponse(responseData);
      setLastResponse(response);
      navigate("/result");
    } catch (error) {
      console.error("Failed to save response:", error);
      showToast("Failed to save answers. Please try again.", "error");
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    navigate("/create");
  };

  const handleEditQuiz = async (quiz) => {
    const fullQuiz = await getQuizById(quiz.id);
    if (fullQuiz) {
      setEditQuiz(fullQuiz);
      navigate(`/edit/${quiz.id}`);
    }
  };

  useEffect(() => {
    if (route.page === "answer" && route.params.code && !currentQuiz) {
      const loadQuiz = async () => {
        setLoading(true);
        try {
          const quiz = await getQuizByCode(route.params.code);
          if (quiz) {
            setCurrentQuiz(quiz);
          } else {
            showToast("Quiz not found! Check the code 😕", "error");
          }
        } catch (error) {
          console.error("Failed to load quiz:", error);
          showToast("Failed to load quiz.", "error");
        }
        setLoading(false);
      };
      loadQuiz();
    }
  }, [route.page, route.params.code]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
          color: "white",
        }}
      >
        <ParticleBackground />
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid rgba(255,255,255,0.2)",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: 15,
            zIndex: 1,
          }}
        />
        <p style={{ zIndex: 1 }}>Please wait...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderPage = () => {
    switch (route.page) {
      case "welcome":
        return (
          <PageTransition key="welcome">
            <Welcome
              onCreateQuiz={() => navigate("/templates")}
              onJoinQuiz={handleJoinQuiz}
              onMyQuizzes={() => navigate("/my-quizzes")}
            />
          </PageTransition>
        );

      case "templates":
        return (
          <PageTransition key="templates">
            <TemplateSelector
              onSelect={handleSelectTemplate}
              onBack={() => navigate("/")}
            />
          </PageTransition>
        );

      case "create":
        return (
          <PageTransition key="create">
            <CreateQuiz
              template={selectedTemplate}
              onCreateQuiz={handleCreateQuiz}
              onBack={() => {
                setSelectedTemplate(null);
                navigate("/");
              }}
            />
          </PageTransition>
        );

      case "creator-answer":
        return (
          <PageTransition key="creator-answer">
            <CreatorAnswer
              quiz={pendingQuiz}
              onSubmit={handleCreatorAnswer}
              onBack={() => {
                setPendingQuiz(null);
                navigate("/");
              }}
            />
          </PageTransition>
        );

      case "edit":
        return (
          <PageTransition key="edit">
            <CreateQuiz
              template={
                editQuiz
                  ? {
                      name: editQuiz.title,
                      icon: "✏️",
                      questions: editQuiz.questions,
                    }
                  : null
              }
              onCreateQuiz={handleCreateQuiz}
              onBack={() => {
                setEditQuiz(null);
                navigate("/my-quizzes");
              }}
            />
          </PageTransition>
        );

      case "answer":
        return (
          <PageTransition key="answer">
            <AnswerQuiz
              quiz={currentQuiz}
              onSubmit={handleSubmitResponse}
              onBack={() => {
                setCurrentQuiz(null);
                navigate("/");
              }}
            />
          </PageTransition>
        );

      case "dashboard":
        return (
          <PageTransition key="dashboard">
            <Dashboard
              quizId={route.params.quizId}
              onBack={() => navigate("/")}
            />
          </PageTransition>
        );

      case "result":
        return (
          <PageTransition key="result">
            <Result
              response={lastResponse}
              quiz={currentQuiz}
              onBack={() => {
                setLastResponse(null);
                setCurrentQuiz(null);
                navigate("/");
              }}
            />
          </PageTransition>
        );

      case "myquizzes":
        return (
          <PageTransition key="myquizzes">
            <MyQuizzes
              onBack={() => navigate("/")}
              onOpenDashboard={(quizId) => navigate(`/dashboard/${quizId}`)}
              onEditQuiz={handleEditQuiz}
            />
          </PageTransition>
        );

      default:
        return (
          <PageTransition key="welcome-default">
            <Welcome
              onCreateQuiz={() => navigate("/templates")}
              onJoinQuiz={handleJoinQuiz}
              onMyQuizzes={() => navigate("/my-quizzes")}
            />
          </PageTransition>
        );
    }
  };

  return (
    <>
      <ParticleBackground />
      <FloatingDecorations variant="mixed" count={10} />
      <ToastContainer />
      <MobileNav currentPage={route.page} onNavigate={navigate} />
      <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
    </>
  );
}

export default App;