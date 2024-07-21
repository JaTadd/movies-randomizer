// src/components/ChatRoom.js
import React, { useState } from "react";
import './ChatRoom.css'; 

function ChatRoom({ messages, setMessages, socket }) {
  const [newMessage, setNewMessage] = useState("");
  const username = localStorage.getItem("username"); 
  const isAuthenticated = !!username; 

  const handleSendMessage = () => {
    if (newMessage.trim() && isAuthenticated) {
      const message = {
        user: username, 
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", message);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isAuthenticated) {
              handleSendMessage();
            }
          }}
          className="chat-input"
          disabled={!isAuthenticated} // Désactivation de l'input si l'utilisateur n'est pas connecté
          placeholder={
            isAuthenticated ? "Type a message" : "Please log in to chat"
          }
        />
        <button
          onClick={handleSendMessage}
          className="chat-send-button"
          disabled={!isAuthenticated}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
