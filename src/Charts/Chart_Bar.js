import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const dataset = [
  {key: 'Jan', value: 65},
  {key: 'Feb', value: 59},
  {key: 'Mar', value: 80},
  {key: 'Apr', value: 81},
  {key: 'May', value: 56},
  {key: 'Jun', value: 55},
  {key: 'Jul', value: 40}
];


const xAxisProperties = [{ scaleType: 'band', dataKey: 'key'}];
const seriesProperties = [{ dataKey: 'value', label: 'Value' }];

const Bar = (props) => {
  return (
    <BarChart
      dataset={dataset}
      xAxis={xAxisProperties}
      series={seriesProperties}
      width={500}
      height={300}
      tooltip={{trigger: 'none'}}
    />
  );
}

export default Bar;