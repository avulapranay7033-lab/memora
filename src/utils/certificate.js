export async function downloadCertificate(quizData, score, respondentName, gender) {
  try {
    const prefix = gender === "mr" ? "Mr" : "Miss";
    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (2x for high quality)
    canvas.width = 1800;
    canvas.height = 1272;
    
    // Background
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header - MEMORA badge
    ctx.fillStyle = '#6366f1';
    roundRect(ctx, 750, 80, 300, 50, 25);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('💙 MEMORA 💙', 900, 115);
    
    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 72px Georgia';
    ctx.fillText('Certificate of Friendship', 900, 220);
    
    // Subtitle
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 28px Georgia';
    ctx.fillText('This certifies that', 900, 280);
    
    // Name with prefix
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 42px Georgia';
    const prefixWidth = ctx.measureText(prefix).width;
    ctx.textAlign = 'right';
    ctx.fillText(prefix, 850, 400);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 84px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText(respondentName, 870, 400);
    
    // Underline
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(870, 420);
    ctx.lineTo(870 + ctx.measureText(respondentName).width, 420);
    ctx.stroke();
    
    // Description
    ctx.fillStyle = '#475569';
    ctx.font = '28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('has successfully completed the memory challenge', 900, 480);
    
    // Quiz title
    ctx.fillStyle = '#6366f1';
    ctx.font = 'italic bold 36px Georgia';
    ctx.fillText(`"${quizData.title}"`, 900, 540);
    
    // Creator
    ctx.fillStyle = '#64748b';
    ctx.font = '24px Georgia';
    ctx.fillText(`created by ${quizData.creatorName}`, 900, 590);
    
    // Percentage box
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 450, 650, 900, 350, 30);
    ctx.fill();
    
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    roundRect(ctx, 450, 650, 900, 350, 30);
    ctx.stroke();
    
    // Percentage label
    ctx.fillStyle = '#475569';
    ctx.font = '500 32px Georgia';
    ctx.fillText('Your Friendship Percentage is', 900, 720);
    
    // Percentage value
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 144px Georgia';
    ctx.fillText(`${score.percentage}%`, 900, 880);
    
    // Score detail
    ctx.fillStyle = '#64748b';
    ctx.font = '24px Georgia';
    ctx.fillText(`${score.correct} out of ${score.total} answers matched`, 900, 950);
    
    // Footer line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 1100);
    ctx.lineTo(1700, 1100);
    ctx.stroke();
    
    // Date
    ctx.fillStyle = '#64748b';
    ctx.font = '18px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('DATE', 300, 1150);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px Georgia';
    ctx.fillText(date, 300, 1190);
    
    // Trophy
    ctx.font = '72px Georgia';
    ctx.fillText('🏆', 900, 1190);
    
    // Memora
    ctx.fillStyle = '#64748b';
    ctx.font = '18px Georgia';
    ctx.fillText('MEMORA', 1500, 1150);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px Georgia';
    ctx.fillText('💙', 1500, 1190);
    
    // Download
    const link = document.createElement('a');
    link.download = `memora-${gender}-${respondentName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    return true;
  } catch (error) {
    console.error("Certificate generation failed:", error);
    alert("Certificate download failed. Please try again.");
    return false;
  }
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}