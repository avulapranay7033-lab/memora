export function exportResponsesCSV(quiz, responses) {
  if (!quiz || responses.length === 0) return;

  // Build headers
  const headers = [
    "Name",
    "Time Taken (seconds)",
    "Completed At",
    ...quiz.questions.map((q, i) => `Q${i + 1}: ${q.question}`),
  ];

  // Build rows
  const rows = responses.map((resp) => {
    const row = [
      resp.respondentName,
      resp.time_taken || resp.timeTaken || 0,
      resp.completed_at || "",
    ];

    quiz.questions.forEach((_, i) => {
      const answer = resp.answers[i]?.answer || "";
      // Escape CSV special characters
      row.push(`"${String(answer).replace(/"/g, '""')}"`);
    });

    return row;
  });

  // Build CSV content
  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `memora-${quiz.title.replace(/\s+/g, "-")}-responses.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
