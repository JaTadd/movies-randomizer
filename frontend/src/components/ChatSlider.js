// src/components/ChatSlider.js
import React, { useState, useEffect, useCallback } from "react";
import { Drawer } from "@mui/material";
import { FaComments } from "react-icons/fa";
import ChatRoom from "./ChatRoom"; // Assurez-vous que le chemin est correct
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Assurez-vous que le port correspond au serveur Node.js

const ChatSlider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Écouter l'historique des messages
    socket.on("messageHistory", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageHistory");
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const preventPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div>
      <button
        onClick={toggleDrawer(true)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <FaComments size={24} />
      </button>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          style={{ width: 300, padding: 16, height: "100%" }}
          onClick={preventPropagation}
        >
          <ChatRoom
            messages={messages}
            setMessages={setMessages}
            socket={socket}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default ChatSlider;
