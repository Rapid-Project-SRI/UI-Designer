import * as React from 'react';
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

export default function Chart() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'key'}]}
      series={[
        { dataKey: 'value', label: 'Value' }
      ]}
      width={500}
      height={300}
    />
  );
}