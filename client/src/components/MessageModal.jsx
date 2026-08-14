import React from "react";
import ReactDOM from "react-dom";
import "../styles/messageModal.css";

function MessageModal({ isOpen, title, message, type = "success", onClose }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="message-modal-overlay" onClick={onClose}>
      <div className="message-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className={`message-modal-header ${type}`}>
          <div className="modal-header-icon">
            {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
          </div>
          <h3>{title || (type === "success" ? "Success" : type === "error" ? "Error" : "Notification")}</h3>
          <button type="button" className="modal-close-x" onClick={onClose}>×</button>
        </div>

        <div className="message-modal-body">
          <p>{message}</p>
        </div>

        <div className="message-modal-footer">
          <button type="button" className="message-modal-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MessageModal;
