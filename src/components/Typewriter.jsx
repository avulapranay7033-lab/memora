import { useState, useEffect } from "react";

function Typewriter({ texts, speed = 80, pause = 2000, className = "" }) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const currentText = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);

          if (charIndex + 1 === currentText.length) {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          setDisplayText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);

          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return (
    <span className={className}>
      {displayText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

export default Typewriter;
