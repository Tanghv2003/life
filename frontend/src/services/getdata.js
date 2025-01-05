// src/services/getdata.js

import axios from 'axios';

export const getdata = async () => {
  try {
    const response = await axios.get('http://localhost:3001/http');  // Đảm bảo URL này đúng
    console.log("abcc");
    return response.data;  // Trả về dữ liệu cảm biến
    
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    throw error;  // Ném lỗi nếu không thể lấy dữ liệu
  }
};
