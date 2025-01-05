import axios from 'axios';

const BASE_URL = 'http://localhost:3001/daily-check';

// Lấy tất cả daily checks
export const getAllDailyChecks = async () => {
  try {
    const { data } = await axios.get(BASE_URL);
    return data;
  } catch (error) {
    console.error('Không thể lấy danh sách DailyChecks', error);
    throw error;
  }
};

// Lấy daily check theo ngày
export const getDailyCheckByDate = async (date) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/by-date/${date}`);
    return data;
  } catch (error) {
    console.error(`Không thể lấy DailyCheck cho ngày ${date}`, error);
    throw error;
  }
};

// Tạo daily check mới
export const createDailyCheck = async (checkData) => {
  try {
    const { data } = await axios.post(BASE_URL, checkData);
    console.log('Đã thêm DailyCheck:', data);
    return data;
  } catch (error) {
    console.error('Không thể thêm DailyCheck', error);
    throw error;
  }
};

// Cập nhật daily check
export const updateDailyCheck = async (id, checkData) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, checkData);
    return data;
  } catch (error) {
    console.error('Không thể cập nhật DailyCheck', error);
    throw error;
  }
};

// Lấy số ngày có sức khỏe thể chất tốt trong 30 ngày gần nhất
export const getGoodPhysicalHealthDaysInLast30Days = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/physical-health/good-days/last-30-days`);
    return data;
  } catch (error) {
    console.error('Không thể lấy số ngày có sức khỏe thể chất tốt trong 30 ngày gần nhất', error);
    throw error;
  }
};

// Lấy số ngày có sức khỏe tinh thần tốt trong 30 ngày gần nhất
export const getGoodMentalHealthDaysInLast30Days = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/mental-health/good-days/last-30-days`);
    return data;
  } catch (error) {
    console.error('Không thể lấy số ngày có sức khỏe tinh thần tốt trong 30 ngày gần nhất', error);
    throw error;
  }
};