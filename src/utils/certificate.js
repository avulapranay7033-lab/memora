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
    
    // Helper functions
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
    
    function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    }
    
    function drawCornerOrnament(x, y, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Decorative curves
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(40, 0, 60, 20, 60, 60);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0, 40, 20, 60, 60, 60);
      ctx.stroke();
      
      // Small decorative circle
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(30, 30, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // === BACKGROUND ===
    // Main background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1272);
    bgGradient.addColorStop(0, '#fff9e6');
    bgGradient.addColorStop(0.5, '#fef3c7');
    bgGradient.addColorStop(1, '#fde68a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1800, 1272);
    
    // Subtle pattern overlay
    ctx.fillStyle = 'rgba(212, 175, 55, 0.03)';
    for (let i = 0; i < 1800; i += 40) {
      for (let j = 0; j < 1272; j += 40) {
        if ((i + j) % 80 === 0) {
          ctx.fillRect(i, j, 20, 20);
        }
      }
    }
    
    // === DECORATIVE BORDERS ===
    // Outer gold border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1720, 1192);
    
    // Inner border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 1680, 1152);
    
    // Decorative line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 80, 1640, 1112);
    
    // === CORNER ORNAMENTS ===
    drawCornerOrnament(80, 80, 0);
    drawCornerOrnament(1720, 80, Math.PI / 2);
    drawCornerOrnament(1720, 1192, Math.PI);
    drawCornerOrnament(80, 1192, -Math.PI / 2);
    
    // === DECORATIVE STARS ===
    ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
    drawStar(150, 150, 5, 20, 10);
    ctx.fill();
    drawStar(1650, 150, 5, 20, 10);
    ctx.fill();
    drawStar(150, 1122, 5, 20, 10);
    ctx.fill();
    drawStar(1650, 1122, 5, 20, 10);
    ctx.fill();
    
    // === MEMORA BADGE ===
    // Badge shadow
    ctx.shadowColor = 'rgba(99, 102, 241, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    
    // Badge background
    const badgeGradient = ctx.createLinearGradient(750, 100, 750, 150);
    badgeGradient.addColorStop(0, '#6366f1');
    badgeGradient.addColorStop(1, '#4f46e5');
    ctx.fillStyle = badgeGradient;
    drawRoundRect(750, 100, 300, 60, 30);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💙 MEMORA 💙', 900, 142);
    
    // === MAIN TITLE ===
    // Title shadow
    ctx.shadowColor = 'rgba(30, 41, 59, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 88px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Friendship', 900, 270);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Decorative line under title
    const titleLineGradient = ctx.createLinearGradient(500, 300, 1300, 300);
    titleLineGradient.addColorStop(0, 'transparent');
    titleLineGradient.addColorStop(0.5, '#d4af37');
    titleLineGradient.addColorStop(1, 'transparent');
    ctx.strokeStyle = titleLineGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(500, 300);
    ctx.lineTo(1300, 300);
    ctx.stroke();
    
    // === SUBTITLE ===
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 36px Georgia';
    ctx.fillText('This certifies that', 900, 370);
    
    // === NAME SECTION ===
    // Name with prefix
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 52px Georgia';
    ctx.textAlign = 'right';
    ctx.fillText(prefix, 820, 490);
    
    // Name shadow
    ctx.shadowColor = 'rgba(99, 102, 241, 0.2)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 104px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText(respondentName, 850, 490);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Decorative underline
    const nameWidth = ctx.measureText(respondentName).width;
    const underlineGradient = ctx.createLinearGradient(850, 510, 850 + nameWidth, 510);
    underlineGradient.addColorStop(0, '#6366f1');
    underlineGradient.addColorStop(0.5, '#a855f7');
    underlineGradient.addColorStop(1, '#6366f1');
    ctx.strokeStyle = underlineGradient;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(850, 510);
    ctx.lineTo(850 + nameWidth, 510);
    ctx.stroke();
    
    // === DESCRIPTION ===
    ctx.fillStyle = '#475569';
    ctx.font = '36px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('has successfully completed the memory challenge', 900, 600);
    
    // Quiz title
    ctx.fillStyle = '#6366f1';
    ctx.font = 'italic bold 44px Georgia';
    ctx.fillText(`"${quizData.title}"`, 900, 680);
    
    // Creator
    ctx.fillStyle = '#64748b';
    ctx.font = '32px Georgia';
    ctx.fillText(`created by ${quizData.creatorName}`, 900, 740);
    
    // === PERCENTAGE BOX ===
    // Box shadow
    ctx.shadowColor = 'rgba(99, 102, 241, 0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    
    // White box
    ctx.fillStyle = '#ffffff';
    drawRoundRect(450, 790, 900, 380, 40);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Box border gradient
    const borderGradient = ctx.createLinearGradient(450, 790, 1350, 1170);
    borderGradient.addColorStop(0, '#6366f1');
    borderGradient.addColorStop(0.5, '#a855f7');
    borderGradient.addColorStop(1, '#6366f1');
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 6;
    drawRoundRect(450, 790, 900, 380, 40);
    ctx.stroke();
    
    // Percentage label
    ctx.fillStyle = '#475569';
    ctx.font = '500 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Friendship Percentage is', 900, 870);
    
    // Big percentage with gradient
    const percentGradient = ctx.createLinearGradient(900, 900, 900, 1080);
    percentGradient.addColorStop(0, '#6366f1');
    percentGradient.addColorStop(0.5, '#a855f7');
    percentGradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = percentGradient;
    ctx.font = 'bold 200px Arial';
    ctx.fillText(`${score.percentage}%`, 900, 1070);
    
    // Score details
    ctx.fillStyle = '#64748b';
    ctx.font = '32px Arial';
    ctx.fillText(`${score.correct} out of ${score.total} answers matched`, 900, 1130);
    
    // === FOOTER ===
    // Footer line
    const footerGradient = ctx.createLinearGradient(100, 1200, 1700, 1200);
    footerGradient.addColorStop(0, 'transparent');
    footerGradient.addColorStop(0.5, '#d4af37');
    footerGradient.addColorStop(1, 'transparent');
    ctx.strokeStyle = footerGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 1200);
    ctx.lineTo(1700, 1200);
    ctx.stroke();
    
    // Date
    ctx.fillStyle = '#64748b';
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DATE', 300, 1230);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px Georgia';
    ctx.fillText(date, 300, 1270);
    
    // Trophy
    ctx.font = '90px Arial';
    ctx.fillText('🏆', 900, 1270);
    
    // Memora
    ctx.fillStyle = '#64748b';
    ctx.font = '22px Arial';
    ctx.fillText('MEMORA', 1500, 1230);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px Georgia';
    ctx.fillText('💙', 1500, 1270);
    
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