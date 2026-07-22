// Supabase Configuration
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rxrtfiqjyyxjedvcabrw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cnRmaXFqeXl4amVkdmNhYnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MzcwOTMsImV4cCI6MjEwMDIxMzA5M30.BBavI7BqWkzhkmgoWMOJ0fwHNrOaKOrzx3lD9DPDmRE";

export let supabase = null;
export let isSupabaseReady = false;

// Always try to initialize Supabase
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  isSupabaseReady = true;
  console.log("✅ Supabase connected successfully!");
} catch (error) {
  console.error("❌ Supabase init failed:", error);
  console.warn("⚠️ Using localStorage fallback.");
}

// ===== HELPER FUNCTIONS =====

export function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ===== QUIZ OPERATIONS =====

export async function saveQuiz(quizData) {
  const code = generateCode();
  const quiz = {
    creator_name: quizData.creatorName,
    title: quizData.title,
    questions: quizData.questions,
    share_code: code,
  };

  if (isSupabaseReady) {
    const { data, error } = await supabase
      .from("quizzes")
      .insert([quiz])
      .select()
      .single();

    if (error) throw error;
    return { ...data, id: data.id, shareCode: data.share_code, creatorName: data.creator_name };
  } else {
    quiz.id = "local_" + Date.now();
    quiz.share_code = code;
    quiz.created_at = new Date().toISOString();
    const existing = JSON.parse(localStorage.getItem("memora_quizzes") || "[]");
    existing.push(quiz);
    localStorage.setItem("memora_quizzes", JSON.stringify(existing));
    return { ...quiz, shareCode: code };
  }
}

export async function getQuizByCode(code) {
  if (isSupabaseReady) {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("share_code", code)
      .single();

    if (error || !data) return null;
    return { ...data, shareCode: data.share_code, creatorName: data.creator_name };
  } else {
    const quizzes = JSON.parse(localStorage.getItem("memora_quizzes") || "[]");
    const quiz = quizzes.find((q) => q.share_code === code);
    if (!quiz) return null;
    return { ...quiz, shareCode: quiz.share_code, creatorName: quiz.creator_name };
  }
}

export async function getQuizById(id) {
  if (isSupabaseReady) {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return { ...data, shareCode: data.share_code, creatorName: data.creator_name };
  } else {
    const quizzes = JSON.parse(localStorage.getItem("memora_quizzes") || "[]");
    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) return null;
    return { ...quiz, shareCode: quiz.share_code, creatorName: quiz.creator_name };
  }
}

export async function getAllQuizzes() {
  if (isSupabaseReady) {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data.map((d) => ({ ...d, shareCode: d.share_code, creatorName: d.creator_name }));
  } else {
    const quizzes = JSON.parse(localStorage.getItem("memora_quizzes") || "[]");
    return quizzes
      .map((q) => ({ ...q, shareCode: q.share_code, creatorName: q.creator_name }))
      .reverse();
  }
}

// ===== RESPONSE OPERATIONS =====

export async function saveResponse(responseData) {
  const response = {
    quiz_id: responseData.quizId,
    respondent_name: responseData.respondentName,
    answers: responseData.answers,
    time_taken: responseData.timeTaken || 0,
  };

  if (isSupabaseReady) {
    const { data, error } = await supabase
      .from("responses")
      .insert([response])
      .select()
      .single();

    if (error) throw error;
    return { ...data, quizId: data.quiz_id, respondentName: data.respondent_name };
  } else {
    response.id = "local_" + Date.now();
    response.completed_at = new Date().toISOString();
    const existing = JSON.parse(localStorage.getItem("memora_responses") || "[]");
    existing.push(response);
    localStorage.setItem("memora_responses", JSON.stringify(existing));
    return { ...response, quizId: response.quiz_id, respondentName: response.respondent_name };
  }
}

export async function getResponsesForQuiz(quizId) {
  if (isSupabaseReady) {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .eq("quiz_id", quizId)
      .order("completed_at", { ascending: false });

    if (error) return [];
    return data.map((d) => ({
      ...d,
      quizId: d.quiz_id,
      respondentName: d.respondent_name,
    }));
  } else {
    const responses = JSON.parse(localStorage.getItem("memora_responses") || "[]");
    return responses
      .filter((r) => r.quiz_id === quizId)
      .map((r) => ({ ...r, quizId: r.quiz_id, respondentName: r.respondent_name }))
      .reverse();
  }
}