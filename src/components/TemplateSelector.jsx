import { motion } from "framer-motion";
import templates from "../data/templates";
import "./TemplateSelector.css";

function TemplateSelector({ onSelect, onBack }) {
  return (
    <div className="template-page">
      <div className="template-container">
        <motion.button
          className="back-btn"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Back
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✨ Choose a Template
        </motion.h1>
        <motion.p
          className="template-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Start with a template or build from scratch
        </motion.p>

        <div className="template-grid">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              className="template-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.07 }}
              whileHover={{ y: -5, borderColor: template.color }}
              onClick={() => onSelect(template)}
            >
              <div
                className="template-icon"
                style={{ background: `${template.color}22`, color: template.color }}
              >
                {template.icon}
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.questions.length} questions</p>
              </div>
              <div className="template-arrow">→</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;
