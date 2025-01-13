from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import Chatbot  # Import class Chatbot

app = Flask(__name__)
CORS(app, resources={
    r"/chat": {
        "origins": ["http://localhost:3000"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Khởi tạo chatbot
chatbot = Chatbot(
    model_path='save/chatbot_model.joblib',
    vectorizer_path='save/vectorizer.joblib',
    data_path='data2.json'
)

# Train model khi khởi động server
print("Initializing chatbot models...")
chatbot.train()

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})
    
    try:
        # Lấy message từ request
        data = request.json
        user_message = data.get('message', '')
        print("Received message:", user_message)  # Debug log

        if not user_message:
            return jsonify({
                "response": "Vui lòng nhập tin nhắn"
            })

        # Phát hiện ngôn ngữ của tin nhắn
        language = chatbot.detect_language(user_message)
        
        # Dự đoán intent
        intent = chatbot.predict_intent(user_message, language)
        
        if intent:
            # Tạo response dựa trên intent và ngôn ngữ
            bot_response = chatbot.generate_response(intent, language)
        else:
            # Trả về thông báo lỗi theo ngôn ngữ
            error_messages = {
                'vi': "Xin lỗi, tôi không hiểu ý bạn. Bạn có thể nói rõ hơn được không?",
                'en': "Sorry, I don't understand. Could you please be more specific?"
            }
            bot_response = error_messages.get(language, error_messages['en'])

        return jsonify({
            "response": bot_response
        })

    except Exception as e:
        print("Error:", str(e))  # Debug log
        return jsonify({
            "response": "Đã có lỗi xảy ra, vui lòng thử lại sau."
        }), 500

if __name__ == '__main__':
    app.run(debug=True)