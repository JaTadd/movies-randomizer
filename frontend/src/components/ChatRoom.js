// src/components/ChatRoom.js
import React, { useState } from "react";

function ChatRoom({ messages, setMessages, socket }) {
  const [newMessage, setNewMessage] = useState("");
  const username = localStorage.getItem("username"); // Récupérer le username
  const isAuthenticated = !!username; // Vérifier si l'utilisateur est authentifié

  const handleSendMessage = () => {
    if (newMessage.trim() && isAuthenticated) {
      const message = {
        user: username, // Utiliser le pseudo de l'utilisateur
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", message);
      setNewMessage("");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          height: "calc(100% - 60px)",
          overflowY: "auto",
          padding: "10px",
          border: "1px solid gray",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "10px 0" }}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "10px",
          backgroundColor: "white",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isAuthenticated) {
              handleSendMessage();
            }
          }}
          style={{ width: "80%" }}
          disabled={!isAuthenticated} // Désactivation de l'input si l'utilisateur n'est pas connecté
          placeholder={
            isAuthenticated ? "Type a message" : "Please log in to chat"
          }
        />
        <button
          onClick={handleSendMessage}
          style={{ width: "20%" }}
          disabled={!isAuthenticated}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
