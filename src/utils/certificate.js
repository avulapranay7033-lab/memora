export async function downloadCertificate(quizData, score, respondentName, gender) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1800;
    canvas.height = 1272;
    
    // BIG RED BACKGROUND
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 1800, 1272);
    
    // BIG WHITE TEXT
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 150px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TEST CERTIFICATE', 900, 600);
    ctx.fillText(`${score.percentage}%`, 900, 800);
    
    // Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `test-certificate.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Failed:", error);
    return false;
  }
}