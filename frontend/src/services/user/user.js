import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

export const userService = {
  // Lấy thông tin của một user
  async getUser(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Lấy thông tin BMI của user
  async getUserBMI(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}/bmi`);
      return response.data;
    } catch (error) {
      console.error('Error fetching BMI:', error);
      throw error;
    }
  },

  // Cập nhật thông tin user
  async updateUser(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};