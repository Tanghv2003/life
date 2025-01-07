import React, { useEffect, useState } from "react";
import heartPredictionService from "../../services/predic"; // Đảm bảo đường dẫn đúng
import './Prediction.css'
function Prediction() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  
  // Tạo userId ngay trong component (có thể lấy từ localStorage hoặc mặc định)
  const userId = "67671fc9f438338fceba7540"; // Hoặc sử dụng giá trị lấy từ localStorage: localStorage.getItem('userId')

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await heartPredictionService.getPredictionsByUserId(userId);
        const formattedData = data.map((item) => ({
          ...item,
          createdAt: item.createdAt?.$date || item.createdAt,
          updatedAt: item.updatedAt?.$date || item.updatedAt,
        }));
        setPredictions(formattedData);
      } catch (err) {
        setError("Failed to fetch predictions");
        console.error(err);
      }
    };

    fetchPredictions();
  }, [userId]);

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
            <li className="prediction-item" key={item._id.$oid}>
              <p className="prediction-text">
                <strong className="prediction-label">PREDICTION</strong> {item._id.$oid}
              </p>
              <p className="prediction-text">
                <strong className="prediction-label">Created At:</strong>{" "}
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
              </p>
              <p className="prediction-text">
                <strong className="prediction-label">Updated At:</strong>{" "}
                {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}
              </p>
              <h3>Models and Predictions:</h3>
              <ul className="model-prediction-list">
                {item.predictions.map((prediction) => (
                  <li className="model-prediction-item" key={prediction._id.$oid}>
                    <p className="model-prediction-text">
                      <strong className="model-label">Model:</strong> {prediction.model}
                    </p>
                    <p className="model-prediction-text">
                      <strong className="model-label">Prediction:</strong> {prediction.prediction}
                    </p>
                    <p className="model-prediction-text">
                      <strong className="model-label">Probability:</strong> {prediction.probability}%
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
