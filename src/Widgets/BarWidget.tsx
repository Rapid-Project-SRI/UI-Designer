import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { BarChart } from '@mui/x-charts/BarChart';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

interface BarWidgetProps {
  chartData: { datasets: { data: number[] }[] };
  widgetId: string;
}

const BarWidget: React.FC<NodeProps<BarWidgetProps>> = observer(({ data }) => {
  const { chartData, widgetId } = data;
  const { label, font, width, fontSize } = useWidgetCustomization(widgetId);

  if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
    return <p>Loading chart data...</p>;
  }

  const dataset = chartData.datasets[0].data.map((value, index) => ({
    key: `Month ${index + 1}`,
    value,
  }));

  return (
    <div style={{ margin: 10, background: 'transparent', border: 'none', width, fontFamily: font }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <div style={{ fontSize, color: '#222', fontFamily: font, marginBottom: 4 }}>{label}</div>
      <BarChart
        dataset={dataset}
        xAxis={[{ scaleType: 'band', dataKey: 'key' }]}
        series={[{ dataKey: 'value', label: 'Value' }]}
        width={width}
        height={200}
        tooltip={{ trigger: 'none' }}
      />
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
});

export default BarWidget;