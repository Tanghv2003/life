import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = "http://localhost:5000/chat";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage === "" || isLoading) return;

    const newUserMessage = { sender: "user", text: trimmedMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setUserMessage("");
    setIsLoading(true);

    try {
      console.log('Sending message:', trimmedMessage); // Debug log
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: trimmedMessage 
        }),
        mode: 'cors',
        credentials: 'omit'  // Changed from 'include' to 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response:', data); // Debug log

      const botResponse = { 
        sender: "bot", 
        text: data.response || "Không có phản hồi từ server"
      };

      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Lỗi kết nối với server. Vui lòng thử lại.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
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
            className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
          >
            <p>{message.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <p>Đang xử lý...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || !userMessage.trim()}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chatbot;