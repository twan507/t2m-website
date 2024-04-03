import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineController,
} from 'chart.js';

// Đăng ký các thành phần cần thiết từ chart.js
ChartJS.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ChartData {
    _id: string;
    createdAt: string;
    price: number;
}

interface LineChartProps {
    width: string;
    height: string;
    data: ChartData[];
}

const UsersChart: React.FC<LineChartProps> = ({ width, height, data }) => {

    // Chuyển đổi và gom nhóm dữ liệu
    const groupedData = data.reduce((acc, item) => {
        const date = new Date(item.createdAt).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const cumulativeData = sortedDates.reduce((acc, date, index) => {
        if (index === 0) {
            acc.push(groupedData[date]);
        } else {
            acc.push(acc[index - 1] + groupedData[date]);
        }
        return acc;
    }, [] as number[]);

    const pricesData = sortedDates.map(date => groupedData[date]);

    const chartData: any = {
        labels: sortedDates,
        datasets: [
            {
                type: 'line',
                label: 'Số tài khoản luỹ kế',
                data: cumulativeData,
                borderColor: '#98217c',
                backgroundColor: '#98217c',
            },
            {
                type: 'bar',
                label: 'Tài khoản mở trong ngày',
                data: pricesData,
                borderColor: '#1777ff',
                backgroundColor: '#1777ff',
            }
        ],
    };

    const options = {
        responsive: true, // Make sure the chart is responsive
        maintainAspectRatio: false, // Allows you to set custom width and height without maintaining the aspect ratio
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                grid: {
                    display: false, // This will remove the vertical grid lines
                }
            }
        },
    };

    return (
        <div style={{ width: width, height: height }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default UsersChart;