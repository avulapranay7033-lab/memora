import { toPng } from "html-to-image";

export async function downloadCertificate(quizData, score, respondentName, gender) {
  try {
    // Create certificate element dynamically
    const certElement = createCertificateElement(quizData, score, respondentName, gender);
    
    // Add to body temporarily
    document.body.appendChild(certElement);
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture as PNG
    const dataUrl = await toPng(certElement, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: "#fef3c7",
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
    return false;
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
    font-family: 'Georgia', serif;
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
          font-family: 'Georgia', serif;
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
            font-family: 'Georgia', serif;
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
            background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
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