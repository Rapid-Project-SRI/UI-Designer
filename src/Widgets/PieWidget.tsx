import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { PieChart } from '@mui/x-charts/PieChart';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

interface PieWidgetProps {
  data: { id: number; value: number}[];
  widgetId: string;
}

const PieWidget: React.FC<NodeProps<PieWidgetProps>> = observer(({ data }) => {
  const { data: pieData, widgetId } = data;
  const { label, font, width, fontSize, color } = useWidgetCustomization(widgetId);

  if (!pieData || !Array.isArray(pieData) || pieData.length === 0) {
    return <p>Loading chart data...</p>;
  }

  return (
    <div style={{ width, height: 120, border: 'none', fontFamily: font, boxSizing: 'border-box' }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      <div style={{ fontSize, color: '#222', fontFamily: font, marginBottom: 4 }}>{label}</div>
      <PieChart
        colors={[color, 'blue', 'yellow']}
        series={[
          {
            arcLabel: (item) => `${item.value}%`,
            data: pieData,
          },
        ]}
        width={width}
        height={Math.round(width / 2)}
        tooltip={{ trigger: 'none' }}
      />
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
    </div>
  );
});

export default PieWidget;