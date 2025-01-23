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

// Lấy phân tích giấc ngủ
export const getSleepAnalysis = async () => {
  try {
    const response = await axios.get('http://localhost:3001/http/sleep-analysis');
    return response.data;
    // return 1;
  } catch (error) {
    console.error('Lỗi khi lấy phân tích giấc ngủ:', error);
    throw error;
  }
};

// Lấy trạng thái dữ liệu
export const getDataStatus = async () => {
  try {
    const response = await axios.get('http://localhost:3001/http/data-status');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy trạng thái dữ liệu:', error);
    throw error;
  }
};

// Lấy thời gian ngủ 7 ngày
export const getSleepTime7Days = async () => {
  try {
    const response = await axios.get('http://localhost:3001/http/sleep-time-7-days');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thời gian ngủ 7 ngày:', error);
    throw error;
  }
};

// lays nhiệt độ tốt nhất
export const getTemperature = async () => {
  try {
    const response = await axios.get('http://localhost:3001/http/temperature');
    return response.data;
   
  } catch (error) {
    console.error('Lỗi khi lấy nheiejt độ tốt nhất:', error);
    throw error;
  }
};
