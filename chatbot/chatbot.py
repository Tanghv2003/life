import numpy as np
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import joblib
import os
from langdetect import detect

class Chatbot:
    def __init__(self, model_path='save/chatbot_model.joblib', 
                 vectorizer_path='save/vectorizer.joblib', 
                 data_path='data2.json'):
        """
        Khởi tạo Chatbot với các đường dẫn cho model, vectorizer và data
        """
        self.model_path = model_path
        self.vectorizer_path = vectorizer_path
        self.data_path = data_path
        self.model = None
        self.vectorizer = None
        self.data = None
        self.df = None
        # Dictionary chứa các model và vectorizer cho từng ngôn ngữ
        self.language_models = {}
        self.language_vectorizers = {}
        self.supported_languages = ['en', 'vi']  # Các ngôn ngữ được hỗ trợ
        
    def detect_language(self, text):
        """
        Phát hiện ngôn ngữ của văn bản đầu vào và map về ngôn ngữ được hỗ trợ
        """
        try:
            detected = detect(text)
            # Map về các ngôn ngữ được hỗ trợ
            if detected in self.supported_languages:
                return detected
            return 'en'  # Default to English if unsupported language
        except:
            return 'en'
            
    def load_data(self):
        """
        Đọc và xử lý dữ liệu từ file JSON, tổ chức theo ngôn ngữ
        """
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            
            # Tạo DataFrame riêng cho từng ngôn ngữ
            language_dfs = {lang: {"tag": [], "patterns": [], "responses": []} 
                          for lang in self.supported_languages}
            
            for intent in self.data['intents']:
                tag = intent['tag']
                
                # Xử lý patterns theo ngôn ngữ
                for pattern in intent['patterns']:
                    lang = self.detect_language(pattern)
                    if lang in self.supported_languages:
                        language_dfs[lang]["tag"].append(tag)
                        language_dfs[lang]["patterns"].append(pattern)
                        language_dfs[lang]["responses"].append(intent['responses'][lang])
            
            # Chuyển đổi dict thành DataFrame cho mỗi ngôn ngữ
            self.language_dfs = {
                lang: pd.DataFrame.from_dict(data) 
                for lang, data in language_dfs.items()
            }
            
            return True
        except Exception as e:
            print(f"Lỗi khi đọc dữ liệu: {str(e)}")
            return False

    def train(self, force=False):
        """
        Huấn luyện model riêng cho từng ngôn ngữ
        """
        try:
            if not force and all(os.path.exists(f"{self.model_path}_{lang}") and 
                               os.path.exists(f"{self.vectorizer_path}_{lang}")
                               for lang in self.supported_languages):
                print("Loading existing models...")
                for lang in self.supported_languages:
                    self.language_models[lang] = joblib.load(f"{self.model_path}_{lang}")
                    self.language_vectorizers[lang] = joblib.load(f"{self.vectorizer_path}_{lang}")
                return True

            print("Training new models...")
            if not self.load_data():
                return False

            # Train model cho từng ngôn ngữ
            for lang in self.supported_languages:
                if lang not in self.language_dfs or self.language_dfs[lang].empty:
                    continue
                    
                X = self.language_dfs[lang]['patterns']
                y = self.language_dfs[lang]['tag']
                
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=42
                )

                # Tạo và train vectorizer
                vectorizer = TfidfVectorizer()
                X_train_vec = vectorizer.fit_transform(X_train)
                
                # Tạo và train model
                model = SVC()
                model.fit(X_train_vec, y_train)

                # Lưu model và vectorizer
                self.language_models[lang] = model
                self.language_vectorizers[lang] = vectorizer
                
                joblib.dump(model, f"{self.model_path}_{lang}")
                joblib.dump(vectorizer, f"{self.vectorizer_path}_{lang}")
            
            return True
        except Exception as e:
            print(f"Training error: {str(e)}")
            return False

    def predict_intent(self, user_input, language):
        """
        Dự đoán intent dựa trên input và ngôn ngữ
        """
        try:
            if not self.language_models or not self.language_vectorizers:
                if not self.train():
                    return None
                    
            if language not in self.language_models:
                return None
                
            vectorizer = self.language_vectorizers[language]
            model = self.language_models[language]
            
            user_input_vec = vectorizer.transform([user_input])
            return model.predict(user_input_vec)[0]
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            return None

    def generate_response(self, intent, language):
        """
        Tạo phản hồi dựa trên intent và ngôn ngữ
        """
        try:
            if not self.data:
                self.load_data()
                
            for intent_data in self.data['intents']:
                if intent_data['tag'] == intent:
                    if isinstance(intent_data['responses'], dict) and language in intent_data['responses']:
                        responses = intent_data['responses'][language]
                        return np.random.choice(responses)
            
            # Thông báo lỗi theo ngôn ngữ
            error_messages = {
                'vi': "Xin lỗi, tôi không hiểu ý bạn.",
                'en': "Sorry, I don't understand."
            }
            return error_messages.get(language, error_messages['en'])
            
        except Exception as e:
            print(f"Response generation error: {str(e)}")
            error_messages = {
                'vi': "Đã xảy ra lỗi khi xử lý câu trả lời.",
                'en': "An error occurred while processing your request."
            }
            return error_messages.get(language, error_messages['en'])

    def chat(self):
        """
        Khởi động giao diện chat với hỗ trợ đa ngôn ngữ
        """
        welcome_messages = {
            'en': "\nChatbot is ready! Type 'quit' or 'exit' to end the conversation.\nType 'retrain' to retrain the model.\n",
            'vi': "\nChatbot đã sẵn sàng! Gõ 'quit' hoặc 'exit' để kết thúc.\nGõ 'retrain' để huấn luyện lại model.\n"
        }
        
        goodbye_messages = {
            'en': "Goodbye!",
            'vi': "Tạm biệt!"
        }
        
        print(welcome_messages['en'])
        print(welcome_messages['vi'])
        
        while True:
            user_input = input("User: ").strip()
            
            if user_input.lower() in ['quit', 'exit']:
                language = self.detect_language(user_input)
                print("Chatbot:", goodbye_messages.get(language, goodbye_messages['en']))
                break
            
            if user_input.lower() == 'retrain':
                print("Retraining the models...")
                self.train(force=True)
                print("Models retrained successfully!")
                continue
            
            # Phát hiện ngôn ngữ và xử lý response
            language = self.detect_language(user_input)
            intent = self.predict_intent(user_input, language)
            
            if intent:
                response = self.generate_response(intent, language)
                print("Chatbot:", response)
            else:
                error_messages = {
                    'vi': "Xin lỗi, đã có lỗi xảy ra.",
                    'en': "Sorry, an error occurred."
                }
                print("Chatbot:", error_messages.get(language, error_messages['en']))