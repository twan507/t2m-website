// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import moment from 'moment';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// interface ChartData {
//   _id: string;
//   createdAt: string; // Giả sử mỗi object đã có trường này
//   price: number;
// }

// interface LineChartProps {
//   data: ChartData[];
// }

// const LineChart: React.FC<LineChartProps> = ({ data }) => {
//   // Sắp xếp dữ liệu theo trường createdAt từ sớm nhất đến muộn nhất
//   const sortedData = [...data].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

//   const chartData = {
//     labels: sortedData.map(item => moment(item.createdAt).format('YYYY-MM-DD')),
//     datasets: [
//       {
//         label: 'Doanh thu theo ngày',
//         data: sortedData.map(item => item.price),
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.5)',
//       },
//     ],
//   };

//   return <Line data={chartData} />;
// };

// export default LineChart;
