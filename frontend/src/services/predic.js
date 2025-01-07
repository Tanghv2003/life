import axios from 'axios';

// URL của API backend
const BASE_URL = 'http://localhost:3001/heart-prediction';

const heartPredictionService = {
//   // Tạo mới dự đoán
//   createPrediction: async (data) => {
//     try {
//       const response = await axios.post(BASE_URL, data);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating prediction:', error);
//       throw error;
//     }
//   },

//   // Lấy tất cả dự đoán
//   getAllPredictions: async () => {
//     try {
//       const response = await axios.get(BASE_URL);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching all predictions:', error);
//       throw error;
//     }
//   },

//   // Lấy dự đoán theo ID
//   getPredictionById: async (id) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching prediction by ID:', error);
//       throw error;
//     }
//   },

  // Lấy dự đoán theo `userId`
  getPredictionsByUserId: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions by user ID:', error);
      throw error;
    }
  },
};

export default heartPredictionService;
