export async function downloadCertificate(quizData, score, respondentName, gender) {
  try {
    const prefix = gender === "mr" ? "Mr" : "Miss";
    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1800;
    canvas.height = 1272;
    
    // Helper function
    function drawRoundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
    
    // === BACKGROUND - BRIGHT YELLOW ===
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, 1800, 1272);
    
    // === THICK COLORED BORDERS ===
    // Outer purple border
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, 1800, 40);
    ctx.fillRect(0, 1232, 1800, 40);
    ctx.fillRect(0, 0, 40, 1272);
    ctx.fillRect(1760, 0, 40, 1272);
    
    // Inner pink border
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(50, 50, 1700, 20);
    ctx.fillRect(50, 1202, 1700, 20);
    ctx.fillRect(50, 50, 20, 1172);
    ctx.fillRect(1730, 50, 20, 1172);
    
    // === CORNER CIRCLES ===
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(100, 100, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(1700, 100, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(100, 1172, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(1700, 1172, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner circles
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(100, 100, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(1700, 100, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(100, 1172, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(1700, 1172, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // === MEMORA BADGE - BIG AND BOLD ===
    ctx.fillStyle = '#6366f1';
    drawRoundRect(700, 120, 400, 80, 40);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💙 MEMORA 💙', 900, 175);
    
    // === MAIN TITLE - BIG AND BOLD ===
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 100px Georgia';
    ctx.fillText('Certificate', 900, 300);
    ctx.fillText('of Friendship', 900, 420);
    
    // === DECORATIVE LINE ===
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(400, 460);
    ctx.lineTo(1400, 460);
    ctx.stroke();
    
    // === SUBTITLE ===
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'italic 40px Georgia';
    ctx.fillText('This certifies that', 900, 530);
    
    // === NAME - HUGE AND BOLD ===
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 120px Georgia';
    ctx.fillText(`${prefix} ${respondentName}`, 900, 680);
    
    // Underline
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(300, 710);
    ctx.lineTo(1500, 710);
    ctx.stroke();
    
    // === DESCRIPTION ===
    ctx.fillStyle = '#475569';
    ctx.font = '38px Georgia';
    ctx.fillText('has successfully completed the memory challenge', 900, 790);
    
    // Quiz title
    ctx.fillStyle = '#ec4899';
    ctx.font = 'italic bold 48px Georgia';
    ctx.fillText(`"${quizData.title}"`, 900, 870);
    
    // Creator
    ctx.fillStyle = '#64748b';
    ctx.font = '34px Georgia';
    ctx.fillText(`created by ${quizData.creatorName}`, 900, 930);
    
    // === PERCENTAGE BOX - BIG AND COLORFUL ===
    // Box background
    ctx.fillStyle = '#ffffff';
    drawRoundRect(500, 980, 800, 220, 30);
    ctx.fill();
    
    // Box border
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 8;
    drawRoundRect(500, 980, 800, 220, 30);
    ctx.stroke();
    
    // Percentage text
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 50px Arial';
    ctx.fillText('Your Friendship Percentage is', 900, 1040);
    
    // Big percentage
    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 120px Arial';
    ctx.fillText(`${score.percentage}%`, 900, 1150);
    
    // Score details
    ctx.fillStyle = '#64748b';
    ctx.font = '28px Arial';
    ctx.fillText(`${score.correct} out of ${score.total} answers matched`, 900, 1190);
    
    // === FOOTER ===
    // Date
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DATE', 300, 1150);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px Georgia';
    ctx.fillText(date, 300, 1190);
    
    // Trophy - BIG
    ctx.font = '100px Arial';
    ctx.fillText('🏆', 1500, 1190);
    
    // === DOWNLOAD ===
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `memora-${gender}-${respondentName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
    
  } catch (error) {
    console.error("Certificate generation failed:", error);
    alert(`Certificate download failed: ${error.message}`);
    return false;
  }
}