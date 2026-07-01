import { useState } from "react";
import socket from "../socket";

interface UsernameModalProps {
  onUsernameSet: (username: string) => void;
}

export default function UsernameModal({ onUsernameSet }: UsernameModalProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    socket.emit("join chat", trimmed);
    onUsernameSet(trimmed);
  };

  return (
    <div className="modal-mask">
      <div className="modal-wrapper">
        <div className="modal-container">
          <div className="modal-header">
            <h3>Welcome to the Chat</h3>
            <p>Choose a display name to get started</p>
          </div>
          <div className="modal-body">
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
              placeholder="Your name..."
            />
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={handleSubmit}>
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
