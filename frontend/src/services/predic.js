import axios from 'axios';

// URL của API backend
const BASE_URL = 'http://localhost:8000'; // Cập nhật lại với URL backend FastAPI

const heartPredictionService = {
  // Lấy dự đoán theo `userId`
  getPredictionsByUserId: async (userId) => {
    try {
      // Gửi yêu cầu GET tới backend API
      const response = await axios.get(`${BASE_URL}/predictions/${userId}`);
      
      // Trả về dữ liệu dự đoán nhận được
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions by user ID:', error);
      throw error;
    }
  },

  // Tạo dự đoán mới
  createPrediction: async (userId, recordId, collectionName = 'predictions_analysis') => {
    try {
      // Cấu trúc dữ liệu yêu cầu cho API
      const requestData = {
        user_id: userId,
        record_id: recordId,
        collection_name: collectionName
      };

      // Gửi yêu cầu POST tới API để tạo dự đoán mới
      const response = await axios.post(`${BASE_URL}/predict`, requestData);
      
      // Trả về kết quả dự đoán
      return response.data;
    } catch (error) {
      console.error('Error creating prediction:', error);
      throw error;
    }
  },

  // Lấy tất cả các dự đoán
  getAllPredictions: async () => {
    try {
      // Gửi yêu cầu GET tới API để lấy tất cả các dự đoán
      const response = await axios.get(`${BASE_URL}/predictions`);
      
      // Trả về dữ liệu dự đoán
      return response.data;
    } catch (error) {
      console.error('Error fetching all predictions:', error);
      throw error;
    }
  },

  // Lấy dự đoán theo ID
  getPredictionById: async (id) => {
    try {
      // Gửi yêu cầu GET tới API để lấy dự đoán theo ID
      const response = await axios.get(`${BASE_URL}/predict/${id}`);
      
      // Trả về kết quả dự đoán
      return response.data;
    } catch (error) {
      console.error('Error fetching prediction by ID:', error);
      throw error;
    }
  }
};

export default heartPredictionService;
