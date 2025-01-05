import React, { useState, useEffect } from 'react';
import { getdata } from '../../services/getdata';
import './HistoryPage.css'

const SensorDataDisplay = () => {
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(11);
  const [timeRange, setTimeRange] = useState("all");

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getdata();  
        setSensorData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Không thể lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []); 

  
  useEffect(() => {
    const filterDataByTime = () => {
      let filtered = [...sensorData];
      const currentTime = new Date();

      
      if (timeRange === "1h") {
        filtered = filtered.filter(data => {
          const dataTime = new Date(data.timestamp);
          return (currentTime - dataTime) <= 3600000;  
        });
      } else if (timeRange === "1d") {
        filtered = filtered.filter(data => {
          const dataTime = new Date(data.timestamp);
          return (currentTime - dataTime) <= 86400000;  
        });
      } else if (timeRange === "1w") {
        filtered = filtered.filter(data => {
          const dataTime = new Date(data.timestamp);
          return (currentTime - dataTime) <= 604800000;
        });
      }

      setFilteredData(filtered);
      setCurrentPage(1);
    };

    filterDataByTime();
  }, [timeRange, sensorData]);

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="sensor-data-display">

      <div>History of data sensor</div>

      
      <div className="time-range-selector">
        <select onChange={(e) => setTimeRange(e.target.value)} value={timeRange}>
          <option value="all">All</option>
          <option value="1h">1 hour</option>
          <option value="1d">1 Day</option>
          <option value="1w">1 Week</option>
        </select>
      </div>

      
      <div className="sensor-table-container">
        <table className="sensor-table">
          <thead>
            <tr>
              <th>STT</th>  
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
              <th>Heart Rate (bpm)</th>
              <th>Acceleration (X, Y, Z)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>  
                  <td>{data.temperature}</td>
                  <td>{data.humidity}</td>
                  <td>{data.heartRate}</td>
                  <td>
                    X: {data.acceleration.x}, Y: {data.acceleration.y}, Z: {data.acceleration.z}
                  </td>
                  <td>{data.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No sensor data found.</td>
              </tr>
            )}
          </tbody>
        </table>

        
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SensorDataDisplay;
