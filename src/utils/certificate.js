export async function downloadCertificate(quizData, score, respondentName, gender) {
  try {
    console.log('Starting certificate generation...');
    
    const prefix = gender === "mr" ? "Mr" : "Miss";
    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long", 
      year: "numeric",
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    console.log('Canvas created');
    
    // High resolution
    canvas.width = 1800;
    canvas.height = 1272;
    
    // Background - light yellow
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, 1800, 1272);
    
    console.log('Background drawn');
    
    // Helper function for rounded rectangles
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
    
    // MEMORA Badge
    ctx.fillStyle = '#6366f1';
    drawRoundRect(750, 80, 300, 50, 25);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💙 MEMORA 💙', 900, 115);
    
    console.log('Badge drawn');
    
    // Main Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 80px Arial';
    ctx.fillText('Certificate of Friendship', 900, 240);
    
    // Subtitle
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 32px Arial';
    ctx.fillText('This certifies that', 900, 310);
    
    console.log('Title drawn');
    
    // Name with prefix
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(prefix, 820, 440);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(respondentName, 850, 440);
    
    // Underline
    const nameWidth = ctx.measureText(respondentName).width;
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(850, 460);
    ctx.lineTo(850 + nameWidth, 460);
    ctx.stroke();
    
    console.log('Name drawn');
    
    // Description text
    ctx.fillStyle = '#475569';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('has successfully completed the memory challenge', 900, 530);
    
    // Quiz title
    ctx.fillStyle = '#6366f1';
    ctx.font = 'italic bold 40px Arial';
    ctx.fillText(`"${quizData.title}"`, 900, 600);
    
    // Creator name
    ctx.fillStyle = '#64748b';
    ctx.font = '28px Arial';
    ctx.fillText(`created by ${quizData.creatorName}`, 900, 660);
    
    console.log('Description drawn');
    
    // Percentage Box
    ctx.fillStyle = '#ffffff';
    drawRoundRect(450, 720, 900, 380, 30);
    ctx.fill();
    
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 5;
    drawRoundRect(450, 720, 900, 380, 30);
    ctx.stroke();
    
    // Percentage label
    ctx.fillStyle = '#475569';
    ctx.font = '500 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Friendship Percentage is', 900, 800);
    
    // Big percentage
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 180px Arial';
    ctx.fillText(`${score.percentage}%`, 900, 1000);
    
    // Score details
    ctx.fillStyle = '#64748b';
    ctx.font = '28px Arial';
    ctx.fillText(`${score.correct} out of ${score.total} answers matched`, 900, 1060);
    
    console.log('Percentage box drawn');
    
    // Footer line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, 1150);
    ctx.lineTo(1700, 1150);
    ctx.stroke();
    
    // Date section
    ctx.fillStyle = '#64748b';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DATE', 300, 1200);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(date, 300, 1240);
    
    // Trophy
    ctx.font = '80px Arial';
    ctx.fillText('🏆', 900, 1240);
    
    // Memora signature
    ctx.fillStyle = '#64748b';
    ctx.font = '20px Arial';
    ctx.fillText('MEMORA', 1500, 1200);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('💙', 1500, 1240);
    
    console.log('Footer drawn');
    console.log('Certificate complete, downloading...');
    
    // Download the certificate
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `memora-${gender}-${respondentName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Download triggered');
    return true;
    
  } catch (error) {
    console.error("Certificate generation failed:", error);
    alert(`Certificate download failed: ${error.message}\n\nBut your score is ${score.percentage}%!`);
    return false;
  }
}