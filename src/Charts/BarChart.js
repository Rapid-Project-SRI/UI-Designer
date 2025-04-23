import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ chartData }) => {
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return <p>Loading chart data...</p>;
  }

  return (
    <Bar
      data={chartData}
      options={{
        maintainAspectRatio: false
      }}
    />
  );
};

export default BarChart;