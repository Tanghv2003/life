import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

import './rate.css'

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Rate = ({ data }) => {
  // Dữ liệu mặc định nếu không có từ backend
  const defaultData = {
    sleepData: [7, 6, 8, 7.5, 6, 7, 4], // Số giờ ngủ cho từng ngày
    totalDays: 7, // Tổng số ngày trong tuần
    missedDataDays: 1, // Số ngày thiếu dữ liệu
    roomTemperature: [22, 23, 24, 25, 26, 27, 28], // Nhiệt độ phòng cho từng ngày
  };

  // Kết hợp dữ liệu nhận từ props với dữ liệu mặc định
  const finalData = { ...defaultData, ...data };

  // Tính toán số ngày ngủ đúng giờ và ngủ dưới 5 giờ
  const daysOnTime = finalData.sleepData.filter((hours) => hours >= 5).length;
  const missedSleepDays = finalData.sleepData.filter((hours) => hours < 5).length;

  // Tính toán tỷ lệ từng phần
  const onTimePercentage = (daysOnTime / finalData.totalDays) * 100;
  const missedSleepPercentage = (missedSleepDays / finalData.totalDays) * 100;
  const missedDataPercentage = (finalData.missedDataDays / finalData.totalDays) * 100;

  // Dữ liệu cho biểu đồ tròn
  const pieChartData = {
    labels: ['On Time Sleep', 'Missed Sleep', 'Missed Data'],
    datasets: [
      {
        data: [onTimePercentage, missedSleepPercentage, missedDataPercentage],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // On Time Sleep
          'rgba(255, 99, 132, 0.6)', // Missed Sleep
          'rgba(255, 206, 86, 0.6)', // Missed Data
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ cột ngang
  const barChartData = {
    labels: finalData.roomTemperature.map((temp, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Sleep Hours',
        data: finalData.sleepData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="rate">
      <div className="rate__chart">
        <h2>On Time Sleep Percentage</h2>
        <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
      </div>

      <div className="rate__chart">
        <h2>Sleep Hours vs Room Temperature</h2>
        <Bar data={barChartData} options={{ indexAxis: 'y', maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default Rate;
