import { toPng } from "html-to-image";

export async function downloadCertificate(quizData, score, respondentName, gender) {
  try {
    const prefix = gender === "mr" ? "Mr" : "Miss";
    const date = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Create certificate with inline styles only
    const certDiv = document.createElement("div");
    
    // Apply styles directly
    Object.assign(certDiv.style, {
      position: "fixed",
      left: "-9999px",
      top: "0",
      width: "900px",
      height: "636px",
      background: "#fef3c7",
      fontFamily: "Georgia, serif",
      padding: "50px 60px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#1e293b",
    });

    certDiv.innerHTML = `
      <div style="text-align: center;">
        <div style="
          display: inline-block;
          padding: 8px 24px;
          background: #6366f1;
          color: #ffffff;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 15px;
        ">💙 MEMORA 💙</div>
        <h1 style="
          font-size: 48px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 10px 0;
        ">Certificate of Friendship</h1>
        <div style="font-size: 18px; color: #64748b; font-style: italic;">
          This certifies that
        </div>
      </div>

      <div style="text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <div style="margin: 20px 0;">
          <span style="font-size: 28px; color: #6366f1; font-weight: 600;">${prefix}</span>
          <h2 style="
            display: inline-block;
            font-size: 56px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 0 12px;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 8px;
          ">${respondentName}</h2>
        </div>

        <div style="font-size: 18px; color: #475569; margin: 10px 0;">
          has successfully completed the memory challenge
        </div>

        <div style="font-size: 24px; font-weight: 600; color: #6366f1; font-style: italic; margin: 10px 0;">
          "${quizData.title}"
        </div>
        
        <div style="font-size: 16px; color: #64748b;">
          created by ${quizData.creatorName}
        </div>

        <div style="
          margin: 30px auto;
          padding: 30px;
          background: #ffffff;
          border-radius: 20px;
          border: 2px solid #6366f1;
          max-width: 500px;
        ">
          <div style="font-size: 20px; color: #475569; margin-bottom: 10px; font-weight: 500;">
            Your Friendship Percentage is
          </div>
          <div style="
            font-size: 96px;
            font-weight: 800;
            color: #6366f1;
            line-height: 1;
            margin: 10px 0;
          ">${score.percentage}%</div>
          <div style="font-size: 16px; color: #64748b; margin-top: 10px;">
            ${score.correct} out of ${score.total} answers matched
          </div>
        </div>
      </div>

      <div style="
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #6366f1;
      ">
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">
            Date
          </div>
          <div style="font-size: 18px; color: #1e293b; font-weight: 600;">
            ${date}
          </div>
        </div>
        <div style="text-align: center; font-size: 48px;">
          🏆
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">
            Memora
          </div>
          <div style="font-size: 18px; color: #1e293b; font-weight: 600;">
            💙
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(certDiv);
    
    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate image
    const dataUrl = await toPng(certDiv, {
      quality: 1.0,
      pixelRatio: 2,
      cacheBust: true,
      skipAutoScale: true,
    });
    
    document.body.removeChild(certDiv);
    
    // Download
    const link = document.createElement("a");
    link.download = `memora-${gender}-${respondentName}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    console.error("Certificate generation failed:", error);
    alert("Certificate download failed. Please try again.");
    return false;
  }
}