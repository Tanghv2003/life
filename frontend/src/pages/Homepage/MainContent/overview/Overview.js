import React, { useState, useEffect } from 'react';
import { userService } from '../../../../services/user/user';
import { getTemperature, getSleepAnalysis } from '../../../../services/getdata';
import './Overview.css';

const DEFAULT_DATA = {
  bmi: 'N/A',
  temperature: 'N/A',
  sleepData: {
    date: 'N/A',
    sleepHours: 'N/A'
  }
};

const USER_ID = '67671fc9f438338fceba7540';

const Overview = () => {
  const [data, setData] = useState({
    bmi: DEFAULT_DATA.bmi,
    temperature: DEFAULT_DATA.temperature,
    sleepData: DEFAULT_DATA.sleepData
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch BMI
        const bmiResponse = await userService.getUserBMI(USER_ID);
        
        // Fetch Temperature
        const tempResponse = await getTemperature();
        
        // Fetch Sleep Analysis
        const sleepResponse = await getSleepAnalysis();

        setData({
          bmi: bmiResponse?.bmi || DEFAULT_DATA.bmi,
          temperature: tempResponse || DEFAULT_DATA.temperature,
          sleepData: sleepResponse || DEFAULT_DATA.sleepData
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors(prev => ({
          ...prev,
          general: 'Failed to load some data'
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="overview loading">
        <div className="loading-spinner">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="overview">
      {Object.keys(errors).length > 0 && (
        <div className="overview__errors">
          {Object.values(errors).map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
        </div>
      )}

      <div className="overview__content">
        <div className="overview__item">
          <p className="overview__label">BMI</p>
          <p className="overview__value">{data.bmi}</p>
        </div>

        <div className="overview__item">
          <p className="overview__label">Best Temperature</p>
          <p className="overview__value">
            {data.temperature !== 'N/A' ? `${data.temperature} °C` : 'N/A'}
          </p>
        </div>

        <div className="overview__item">
          <p className="overview__label">Sleep Analysis</p>
          <div className="overview__sleep-data">
            <p className="overview__value">
              {data.sleepData.sleepHours !== 'N/A' 
                ? `${data.sleepData.sleepHours} hours` 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;