import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { LineChart } from '@mui/x-charts/LineChart';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

interface LineWidgetProps {
  chartData: { datasets: { data: number[] }[] };
  widgetId: string;
}

const LineWidget: React.FC<NodeProps<LineWidgetProps>> = observer(({ data }) => {
  const { chartData, widgetId } = data;
  const { label, font, width, fontSize } = useWidgetCustomization(widgetId);

  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return <p>Loading chart data...</p>;
  }

  const dataset = chartData.datasets[0].data.map((y, idx) => ({ x: idx + 1, y }));

  return (
    <div style={{ width, height: 120, border: 'none', fontFamily: font, boxSizing: 'border-box' }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      <div style={{ fontSize, color: '#222', fontFamily: font, marginBottom: 4 }}>{label}</div>
      <LineChart
        dataset={dataset}
        xAxis={[{ dataKey: 'x' }]}
        series={[{ dataKey: 'y' }]}
        height={200}
        width={width}
        tooltip={{ trigger: 'none' }}
      />
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
    </div>
  );
});

export default LineWidget;