import React from 'react';
import './Overview.css';

const Overview = ({ data }) => {
  // Dữ liệu mặc định nếu không có từ backend
  const defaultData = {
    weight: 70, // Cân nặng (kg)
    height: 170, // Chiều cao (cm)
    roomTemperature: 25, // Nhiệt độ phòng (°C)
    sleepHours: 8, // Số giờ ngủ trung bình
  };

  // Kết hợp dữ liệu nhận từ props với dữ liệu mặc định
  const finalData = { ...defaultData, ...data };

  // Hàm tính BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 'N/A';
    const heightInMeters = height / 100; // Chuyển đổi chiều cao từ cm sang mét
    return (weight / (heightInMeters * heightInMeters)).toFixed(1); // Tính BMI và làm tròn 1 chữ số
  };

  return (
    <div className="overview">
      <div className="overview__content">
        <div className="overview__item">
          <p className="overview__label">BMI:</p>
          <p className="overview__value">
            {calculateBMI(finalData.weight, finalData.height)}
          </p>
        </div>
        <div className="overview__item">
          <p className="overview__label">Best Temperature:</p>
          <p className="overview__value">{finalData.roomTemperature} °C</p>
        </div>
        <div className="overview__item">
          <p className="overview__label">Average Sleep Hours:</p>
          <p className="overview__value">{finalData.sleepHours} hours</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
