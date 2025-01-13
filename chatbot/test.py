from chatbot import Chatbot

def test_chatbot():
    print("Bắt đầu kiểm tra chatbot...")
    
    # Khởi tạo chatbot
    bot = Chatbot()
    
    # Test huấn luyện
    print("\n1. Test huấn luyện model:")
    success = bot.train(force=False)
    
    
    
    # Test chat interface
    print("\n3. Test giao diện chat:")
    print("Bạn có thể test chat trực tiếp. Gõ 'quit' để thoát.")
    bot.chat()

if __name__ == "__main__":
    test_chatbot()