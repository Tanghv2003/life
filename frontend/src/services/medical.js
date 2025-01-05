import axios from 'axios';

const BASE_URL = 'http://localhost:3001/medical';

export const healthService = {
  // Fetch the health record by ID
  async getHealthRecordById(id) {
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching health record with ID ${id}:`, error);
      throw error;
    }
  },

  // Update the health record
  async updateHealthRecord(id, healthData) {
    try {
      const { data } = await axios.put(`${BASE_URL}/${id}`, healthData);
      return data;
    } catch (error) {
      console.error(`Error updating health record with ID ${id}:`, error);
      throw error;
    }
  },
};