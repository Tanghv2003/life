import React, { useState, useEffect } from 'react';
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
import { 
  getSleepTime7Days, 
  getDataStatus 
} from '../../../../services/getdata';

import './rate.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Rate = () => {
  const [sleepData, setSleepData] = useState([]);
  const [dataStatus, setDataStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sleepTimeResponse = await getSleepTime7Days();
        const dataStatusResponse = await getDataStatus();

        setSleepData(sleepTimeResponse);
        setDataStatus(dataStatusResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Default data if no backend data
  const defaultData = {
    sleepData: [7, 6, 8, 7.5, 6, 7, 4],
    totalDays: 7,
    missedDataDays: 1,
  };

  // Use actual data or default
  const finalSleepData = sleepData.length > 0 
    ? sleepData.map(item => item.sleepHours) 
    : defaultData.sleepData;

  const dataStatusInfo = dataStatus || {
    missDataPercentage: 0,
    sleepPercentage: 0,
    missingDataPercentage: 0
  };

  const pieChartData = {
    labels: ['On Time Sleep', 'Missed Sleep', 'Missed Data'],
    datasets: [{
      data: [
        dataStatusInfo.sleepPercentage, 
        dataStatusInfo.missDataPercentage, 
        dataStatusInfo.missingDataPercentage
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)', 
        'rgba(255, 99, 132, 0.6)', 
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1,
    }],
  };

  const barChartData = {
    labels: finalSleepData.map((_, index) => `Day ${index + 1}`),
    datasets: [{
      label: 'Sleep Hours',
      data: finalSleepData,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="rate">
      <div className="rate__chart">
        <h2>Sleep Status Percentage</h2>
        <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
      </div>
      
      <div className="rate__chart">
        <h2>Sleep Hours per Day</h2>
        <Bar 
          data={barChartData} 
          options={{ 
            indexAxis: 'y', 
            maintainAspectRatio: false 
          }} 
        />
      </div>
    </div>
  );
};

export default Rate;