import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function Chart_Pie() {
  return (
    <PieChart
        colors={['red', 'blue', 'yellow']}  
        series={[
        {
            arcLabel: (item) => `${item.value}%`,
            data: [
                { id: 0, value: 10, label: 'Red' },
                { id: 1, value: 15, label: 'Blue' },
                { id: 2, value: 20, label: 'Yellow' },
            ],
        },
      ]}
      width={400}
      height={200}
      tooltip={{trigger: 'none'}}
    />
  );
}