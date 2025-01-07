import React from "react";
import Prediction from "./Prediction";
import ChatBot from "./Chatbot";
import './AdvicePage.css'
function AdvicePage() {
  return (
    <div className="advice-page-container">
      <Prediction />
      <ChatBot/>
    </div>
  );
}

export default AdvicePage;
