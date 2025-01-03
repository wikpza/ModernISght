import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { GetUserCount } from "../../../../../types/user.type.ts";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
    users: GetUserCount[];
};

const UserRegisteredChart = ({ users: data }: Props) => {
    // Reference to hold the chart instance
    const chartRef = useRef<any>(null);

    // Process the data for Chart.js
    const dates = data.map(item => item.date);
    const counts = data.map(item => item.count);

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Count',
                data: counts,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index' as const, // Correctly typed mode
                intersect: false,
            },
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                type: 'category' as const,
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Count',
                },
            },
        },
    };

    // Cleanup chart instance on unmount
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return <Line ref={chartRef} data={chartData} options={chartOptions} />;
};

export default UserRegisteredChart;
