import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
  _id: string;
  createdAt: string; // Giả sử mỗi object đã có trường này
  price: number;
}

interface LineChartProps {
  data: ChartData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  // Chuyển đổi và gom nhóm dữ liệu
  const groupedData = data.reduce((acc, item) => {
    // Chuyển đổi ngày để bỏ qua giờ và phút
    const date = new Date(item.createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += item.price;
    return acc;
  }, {} as Record<string, number>);

  // Sắp xếp và tính giá trị cộng dồn
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const cumulativeData = sortedDates.reduce((acc, date, index) => {
    if (index === 0) {
      acc.push(groupedData[date]);
    } else {
      acc.push(acc[index - 1] + groupedData[date]);
    }
    return acc;
  }, [] as number[]);

  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Doanh thu cộng dồn theo ngày',
        data: cumulativeData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
