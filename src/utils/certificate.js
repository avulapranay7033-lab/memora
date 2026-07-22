import { toPng } from "html-to-image";

export async function downloadCertificate(elementRef, filename = "memora-certificate.png") {
  try {
    const dataUrl = await toPng(elementRef, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: "#1a1a2e",
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (error) {
    console.error("Certificate download failed:", error);
    return false;
  }
}

export function calculateScore(questions, answers) {
  // For MCQ questions with a "correct" answer, calculate score
  // For text/textarea, just check if answered
  let total = questions.length;
  let answered = answers.filter((a) => a && a.trim() !== "").length;
  return { total, answered, percentage: Math.round((answered / total) * 100) };
}
