import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import "./ShareModal.css";

function ShareModal({ quiz, onClose }) {
  if (!quiz) return null;

  const shareLink = `${window.location.origin}${window.location.pathname}#/quiz/${quiz.shareCode}`;

  const shareWhatsApp = () => {
    const text = `🎯 "${quiz.title}" — Take my friendship memory challenge!\n\n${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareTwitter = () => {
    const text = `Take my "${quiz.title}" memory challenge! 💙`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`,
      "_blank"
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <motion.div
      className="share-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="share-modal"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="share-close" onClick={onClose}>
          ✕
        </button>

        <h2>🔗 Share Quiz</h2>
        <p className="share-subtitle">"{quiz.title}"</p>

        <div className="qr-wrapper">
          <QRCodeSVG
            value={shareLink}
            size={180}
            bgColor="transparent"
            fgColor="#ffffff"
            level="M"
          />
        </div>

        <div className="share-code-big">{quiz.shareCode}</div>

        <div className="share-link-box">
          <span className="share-link-text">{shareLink}</span>
          <button className="copy-mini" onClick={copyLink}>
            📋
          </button>
        </div>

        <div className="share-platforms">
          <motion.button
            className="platform-btn whatsapp"
            onClick={shareWhatsApp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💬 WhatsApp
          </motion.button>
          <motion.button
            className="platform-btn twitter"
            onClick={shareTwitter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🐦 Twitter
          </motion.button>
          <motion.button
            className="platform-btn copy-btn"
            onClick={copyLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 Copy
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ShareModal;
