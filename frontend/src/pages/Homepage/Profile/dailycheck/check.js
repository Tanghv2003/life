import React, { useState, useEffect } from 'react';
import './check.css';
import { createDailyCheck, getDailyCheckByDate, updateDailyCheck } from '../../../../services/daily';

const Check = () => {
  const [date, setDate] = useState('');
  const [physicalHealth, setPhysicalHealth] = useState('');
  const [mentalHealth, setMentalHealth] = useState('');
  const [existingData, setExistingData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm chuyển đổi từ Good/Bad sang "1"/"0"
  const convertHealthStatus = (status) => {
    return status === 'Good' ? 1 : 0;
  };

  // Hàm để kiểm tra dữ liệu đã có cho ngày đã chọn
  const checkExistingData = async (selectedDate) => {
    try {
      const data = await getDailyCheckByDate(selectedDate);
      if (data && data.timestamp === selectedDate) {
        setExistingData(data);
        setPhysicalHealth(data.physicalHealth === 1 ? 'Good' : 'Bad');
        setMentalHealth(data.mentalHealth === 1 ? 'Good' : 'Bad');
        setErrorMessage('');
      } else {
        setExistingData(null);
        setErrorMessage('Dữ liệu chưa tồn tại cho ngày này.');
      }
    } catch (error) {
      console.error('Không thể lấy dữ liệu DailyCheck:', error);
      setErrorMessage('Không thể lấy dữ liệu cho ngày này.');
    }
  };

  useEffect(() => {
    if (date) {
      checkExistingData(date);  // Kiểm tra dữ liệu mỗi khi ngày thay đổi
    }
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dailyCheckData = {
      physicalHealth: convertHealthStatus(physicalHealth),
      mentalHealth: convertHealthStatus(mentalHealth),
      timestamp: date,
    };

    try {
      if (existingData) {
        // Nếu có dữ liệu cũ, gọi update
        const updatedData = await updateDailyCheck(existingData._id, dailyCheckData);
        console.log('Đã cập nhật bản ghi thành công:', updatedData);

        alert('Thông tin đã được cập nhật!');
      } else {
        // Nếu không có dữ liệu cũ, tạo mới
        const response = await createDailyCheck(dailyCheckData);
        console.log('Đã tạo bản ghi thành công:', response);

        alert('Đã lưu thông tin khảo sát!');
      }

      // Reset form
      setDate('');
      setPhysicalHealth('');
      setMentalHealth('');
      setExistingData(null);

    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
      alert('Có lỗi xảy ra khi lưu thông tin!');
    }
  };

  return (
    <div className="survey-container">
      <header className="survey-header">
        <h1 className="survey-title">Daily Check</h1>
      </header>

      <form className="survey-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Date: </label>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {existingData ? (
          <div>
            <h3>Dữ liệu hiện tại:</h3>
            <p>Physical Health: {existingData.physicalHealth === 1 ? 'Good' : 'Bad'}</p>
            <p>Mental Health: {existingData.mentalHealth === 1 ? 'Good' : 'Bad'}</p>
          </div>
        ) : (
          errorMessage && <p className="error-message">{errorMessage}</p>
        )}

        <div className="form-group">
          <label className="form-label">Physical Health: </label>
          <select
            className="form-select"
            value={physicalHealth}
            onChange={(e) => setPhysicalHealth(e.target.value)}
            required
          >
            <option value="">Select level</option>
            <option value="Bad">Bad</option>
            <option value="Good">Good</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mental Health: </label>
          <select
            className="form-select"
            value={mentalHealth}
            onChange={(e) => setMentalHealth(e.target.value)}
            required
          >
            <option value="">Select level</option>
            <option value="Bad">Bad</option>
            <option value="Good">Good</option>
          </select>
        </div>

        <button type="submit" className="form-button">Save Survey</button>
      </form>
    </div>
  );
};

export default Check;
