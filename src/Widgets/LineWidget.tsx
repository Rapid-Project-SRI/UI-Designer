import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { LineChart } from '@mui/x-charts/LineChart';
import StreamInfo from './StreamInfo';

interface LineWidgetProps {
  chartData: { datasets: { data: number[] }[] };
  widgetId: string;
}

const LineWidget: React.FC<NodeProps<LineWidgetProps>> = ({ data }) => {
  const { chartData } = data;

  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return <p>Loading chart data...</p>;
  }

  const dataset = chartData.datasets[0].data.map((y, idx) => ({ x: idx + 1, y }));

  return (
    <div style={{ margin: 10, background: 'transparent', border: 'none' }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <LineChart
        dataset={dataset}
        xAxis={[{ dataKey: 'x' }]}
        series={[{ dataKey: 'y' }]}
        height={200}
        width={300}
        tooltip={{ trigger: 'none' }}
      />
      {data.widgetId && <StreamInfo widgetId={data.widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default LineWidget;