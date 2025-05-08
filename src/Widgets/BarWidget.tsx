import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { BarChart } from '@mui/x-charts/BarChart';

interface BarWidgetProps {
  chartData: { datasets: { data: number[] }[] };
}

const BarWidget: React.FC<NodeProps<BarWidgetProps>> = ({ data }) => {
  const { chartData } = data;

  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return <p>Loading chart data...</p>;
  }

  const dataset = chartData.datasets[0].data.map((value, index) => ({
    key: `Month ${index + 1}`,
    value,
  }));

  return (
    <div style={{ margin: 10, background: 'transparent', border: 'none' }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'key' }]}
        series={[{ dataKey: 'value', label: 'Value' }]}
        width={300}
        height={200}
        tooltip={{ trigger: 'none' }}
      />
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default BarWidget;