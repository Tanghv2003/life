import React, { useState } from "react";
import './Chatbot.css'; // Đảm bảo tạo CSS riêng cho chatbot

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  // Hàm xử lý khi người dùng gửi tin nhắn
  const handleSendMessage = () => {
    if (userMessage.trim() === "") return; // Nếu không có tin nhắn thì không làm gì

    // Thêm tin nhắn của người dùng vào danh sách tin nhắn
    const newMessages = [
      ...messages,
      { sender: "user", text: userMessage },
    ];

    // Giả lập phản hồi của chatbot
    const botResponse = { sender: "bot", text: `Bot says: ${userMessage}` };

    // Thêm phản hồi của bot vào sau tin nhắn người dùng
    setMessages([...newMessages, botResponse]);
    setUserMessage(""); // Xóa trường nhập sau khi gửi
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Chatbot</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "bot"}`}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
