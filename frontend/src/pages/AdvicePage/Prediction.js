import React, { useEffect, useState } from "react";
import heartPredictionService from "../../services/predic"; // Đảm bảo đường dẫn đúng
import './Prediction.css';



function Prediction() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tạo userId ngay trong component (có thể lấy từ localStorage hoặc mặc định)
  // const userId = "67671fc9f438338fceba7540"; // Hoặc sử dụng giá trị lấy từ localStorage: localStorage.getItem('userId')
  // const recordId = "67797cc2a12f2a39e76cfa5e"; // Cung cấp recordId cần thiết cho việc tạo dự đoán mới

  const userId = process.env.REACT_APP_USER_ID; // Đảm bảo bạn đã khai báo trong .env
  const recordId = process.env.REACT_APP_RECORD_ID; // Đảm bảo bạn đã khai báo trong .env
  
  useEffect(() => {
    const createAndFetchPrediction = async () => {
      setIsLoading(true);
      try {
        // Tạo dự đoán mới
        const predictionResponse = await heartPredictionService.createPrediction(userId, recordId);
        
        // Lấy dự đoán đã tạo
        const predictionsData = await heartPredictionService.getPredictionsByUserId(userId);
        setPredictions(predictionsData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch or create predictions");
        setIsLoading(false);
        console.error(err);
      }
    };

    createAndFetchPrediction();
  }, [userId, recordId]);

  if (isLoading) {
    return <div className="prediction-loading">Loading predictions...</div>;
  }

  if (error) {
    return <div className="prediction-error">{error}</div>;
  }

  return (
    <div className="prediction-container">
      {predictions.length === 0 ? (
        <p className="prediction-text">No predictions found.</p>
      ) : (
        <ul className="prediction-list">
          {predictions.map((item) => (
            <li className="prediction-item" key={item._id?.$oid || item.timestamp}>
              <p className="prediction-text">
                <strong className="prediction-label">PREDICTION</strong> {item._id?.$oid || "No ID"}
              </p>
              <p className="prediction-text">
                <strong className="prediction-label">Created At:</strong>{" "}
                {item.timestamp ? new Date(item.timestamp).toLocaleString() : "N/A"}
              </p>
              <h3>Models and Predictions:</h3>
              <ul className="model-prediction-list">
                {item.predictions.map((prediction) => (
                  <li className="model-prediction-item" key={prediction.model}>
                    <p className="model-prediction-text">
                      <strong className="model-label">Model:</strong> {prediction.model}
                    </p>
                    <p className="model-prediction-text">
                      <strong className="model-label">Prediction:</strong> {prediction.prediction}
                    </p>
                    <p className="model-prediction-text">
                      <strong className="model-label">Probability:</strong> {prediction.probability}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Prediction;
