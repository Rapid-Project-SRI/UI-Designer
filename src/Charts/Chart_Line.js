import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const dataset = [
  { x: 1, y: 2 },
  { x: 2, y: 5.5 },
  { x: 3, y: 2 },
  { x: 5, y: 8.5 },
  { x: 8, y: 1.5 },
  { x: 10, y: 5 },
];

export default function Chart_Line() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={[{ dataKey: 'x' }]}
      series={[{ dataKey: 'y' }]}
      height={300}
      width={500}
      tooltip={{trigger: 'none'}}
    />
  );
}