import { toPng } from "html-to-image";

export async function downloadCertificate(quizData, score, respondentName, gender) {
  try {
    // Create certificate element dynamically
    const certElement = createCertificateElement(quizData, score, respondentName, gender);
    
    // Add to body temporarily
    document.body.appendChild(certElement);
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture as PNG - skip external CSS
    const dataUrl = await toPng(certElement, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: "#fef3c7",
      skipFonts: true, // Skip external fonts
      filter: (node) => {
        // Skip style elements to avoid CORS issues
        if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
          return false;
        }
        return true;
      },
    });
    
    // Remove from DOM
    document.body.removeChild(certElement);
    
    // Download
    const link = document.createElement("a");
    link.download = `memora-${gender}-${respondentName}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    console.error("Certificate generation failed:", error);
    // Fallback: try without filters
    try {
      const certElement = createCertificateElement(quizData, score, respondentName, gender);
      document.body.appendChild(certElement);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 900 * 2;
      canvas.height = 636 * 2;
      
      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 900 * 2, 636 * 2);
      gradient.addColorStop(0, '#fef3c7');
      gradient.addColorStop(0.5, '#fde68a');
      gradient.addColorStop(1, '#fbbf24');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text manually
      ctx.textAlign = 'center';
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 28px Georgia';
      ctx.fillText('💙 MEMORA 💙', canvas.width / 2, 100);
      
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 96px Georgia';
      ctx.fillText('Certificate of Friendship', canvas.width / 2, 200);
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 36px Georgia';
      ctx.fillText('This certifies that', canvas.width / 2, 280);
      
      const prefix = gender === "mr" ? "Mr" : "Miss";
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 56px Georgia';
      ctx.fillText(`${prefix} ${respondentName}`, canvas.width / 2, 400);
      
      ctx.fillStyle = '#475569';
      ctx.font = '36px Georgia';
      ctx.fillText('has successfully completed the memory challenge', canvas.width / 2, 480);
      
      ctx.fillStyle = '#6366f1';
      ctx.font = 'italic 48px Georgia';
      ctx.fillText(`"${quizData.title}"`, canvas.width / 2, 560);
      
      ctx.fillStyle = '#64748b';
      ctx.font = '32px Georgia';
      ctx.fillText(`created by ${quizData.creatorName}`, canvas.width / 2, 620);
      
      // Percentage box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(canvas.width / 2 - 300, 700, 600, 300);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 4;
      ctx.strokeRect(canvas.width / 2 - 300, 700, 600, 300);
      
      ctx.fillStyle = '#475569';
      ctx.font = '500 40px Georgia';
      ctx.fillText('Your Friendship Percentage is', canvas.width / 2, 780);
      
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 192px Georgia';
      ctx.fillText(`${score.percentage}%`, canvas.width / 2, 920);
      
      ctx.fillStyle = '#64748b';
      ctx.font = '32px Georgia';
      ctx.fillText(`${score.correct} out of ${score.total} answers matched`, canvas.width / 2, 980);
      
      // Footer
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      
      ctx.fillStyle = '#64748b';
      ctx.font = '24px Georgia';
      ctx.textAlign = 'left';
      ctx.fillText('DATE', 100, 1150);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 36px Georgia';
      ctx.fillText(date, 100, 1200);
      
      ctx.textAlign = 'center';
      ctx.font = '96px Georgia';
      ctx.fillText('🏆', canvas.width / 2, 1200);
      
      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748b';
      ctx.font = '24px Georgia';
      ctx.fillText('MEMORA', canvas.width - 100, 1150);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 36px Georgia';
      ctx.fillText('💙', canvas.width - 100, 1200);
      
      document.body.removeChild(certElement);
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement("a");
      link.download = `memora-${gender}-${respondentName}.png`;
      link.href = dataUrl;
      link.click();
      
      return true;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      return false;
    }
  }
}

function createCertificateElement(quizData, score, respondentName, gender) {
  const prefix = gender === "mr" ? "Mr" : "Miss";
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const certDiv = document.createElement("div");
  certDiv.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 900px;
    height: 636px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
    font-family: Georgia, serif;
    overflow: hidden;
  `;

  certDiv.innerHTML = `
    <div style="
      position: absolute;
      top: -20px;
      left: -20px;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    "></div>
    <div style="
      position: absolute;
      top: -20px;
      right: -20px;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    "></div>
    <div style="
      position: absolute;
      bottom: -20px;
      left: -20px;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    "></div>
    <div style="
      position: absolute;
      bottom: -20px;
      right: -20px;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    "></div>
    
    <div style="
      position: relative;
      z-index: 1;
      padding: 50px 60px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    ">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="
          display: inline-block;
          padding: 8px 24px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 15px;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        ">💙 MEMORA 💙</div>
        <h1 style="
          font-size: 48px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          font-family: Georgia, serif;
        ">Certificate of Friendship</h1>
        <div style="
          font-size: 18px;
          color: #64748b;
          font-style: italic;
        ">This certifies that</div>
      </div>

      <div style="
        text-align: center;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 15px;
      ">
        <div style="
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 12px;
          margin: 20px 0;
        ">
          <span style="
            font-size: 28px;
            color: #6366f1;
            font-weight: 600;
          ">${prefix}</span>
          <h2 style="
            font-size: 56px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 8px;
            font-family: Georgia, serif;
          ">${respondentName}</h2>
        </div>

        <div style="
          font-size: 18px;
          color: #475569;
          margin: 10px 0;
        ">has successfully completed the memory challenge</div>

        <div style="
          font-size: 24px;
          font-weight: 600;
          color: #6366f1;
          font-style: italic;
          margin: 10px 0;
        ">"${quizData.title}"</div>
        
        <div style="
          font-size: 16px;
          color: #64748b;
        ">created by ${quizData.creatorName}</div>

        <div style="
          margin: 30px 0;
          padding: 30px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          border: 2px solid rgba(99, 102, 241, 0.2);
        ">
          <div style="
            font-size: 20px;
            color: #475569;
            margin-bottom: 10px;
            font-weight: 500;
          ">Your Friendship Percentage is</div>
          <div style="
            font-size: 96px;
            font-weight: 800;
            color: #6366f1;
            line-height: 1;
            margin: 10px 0;
          ">${score.percentage}%</div>
          <div style="
            font-size: 16px;
            color: #64748b;
            margin-top: 10px;
          ">${score.correct} out of ${score.total} answers matched</div>
        </div>
      </div>

      <div style="
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid rgba(99, 102, 241, 0.2);
      ">
        <div style="text-align: center;">
          <div style="
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          ">Date</div>
          <div style="
            font-size: 18px;
            color: #1e293b;
            font-weight: 600;
          ">${date}</div>
        </div>
        <div style="text-align: center;">
          <div style="
            font-size: 48px;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          ">🏆</div>
        </div>
        <div style="text-align: center;">
          <div style="
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          ">Memora</div>
          <div style="
            font-size: 18px;
            color: #1e293b;
            font-weight: 600;
          ">💙</div>
        </div>
      </div>
    </div>
  `;

  return certDiv;
}