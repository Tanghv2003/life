import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';
import 'chart.js/auto'
import './InsightPage.css';
import { getdata } from '../../services/getdata';


ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const InsightsPage = () => {
    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getdata(); 
                setSensorData(data); 
            } catch (error) {
                console.error('Không thể lấy dữ liệu:', error);
            }
        };

        fetchData();
    }, []);


    const chartData = {
        labels: sensorData.map(item => new Date(item.timestamp).toLocaleTimeString()), 
        datasets: [
            {
                label: 'Nhịp Tim (bpm)', 
                data: sensorData.map(item => item.heartRate), 
                fill: false,
                borderColor: 'rgb(75, 192, 192)', 
                tension: 0.1,
            },
            {
                label: 'Nhiệt Độ (°C)', 
                data: sensorData.map(item => item.temperature), 
                fill: false,
                borderColor: 'rgb(255, 99, 132)', 
                tension: 0.1,
            },
            {
                label: 'Độ Ẩm (%)', 
                data: sensorData.map(item => item.humidity), 
                fill: false,
                borderColor: 'rgb(54, 162, 235)', 
                tension: 0.1,
            },
            {
                label: 'Gia Tốc (m/s²)', 
                data: sensorData.map(item => Math.sqrt(item.acceleration.x ** 2 + item.acceleration.y ** 2 + item.acceleration.z ** 2)), // Tính gia tốc tổng hợp
                fill: false,
                borderColor: 'rgb(153, 102, 255)', 
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Curve of sensor data',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="insights-page">
            <h1>Health Insights</h1>
            {sensorData.length > 0 ? (
                <section>
                    <h2>Curve of sensor data</h2>
                    <Line data={chartData} options={options} />
                </section>
            ) : (
                <p className="loading-message">loading...</p>
            )}
        </div>
    );
};

export default InsightsPage;
