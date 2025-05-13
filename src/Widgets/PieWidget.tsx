import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { PieChart } from '@mui/x-charts/PieChart';
import StreamInfo from './StreamInfo';

interface PieWidgetProps {
  data: { id: number; value: number; label: string }[];
  widgetId: string;
}

const PieWidget: React.FC<NodeProps<PieWidgetProps>> = ({ data }) => {
  const { data: pieData } = data;

  return (
    <div style={{ margin: 10, background: 'transparent', border: 'none' }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <PieChart
        colors={['red', 'blue', 'yellow']}
        series={[
          {
            arcLabel: (item) => `${item.value}%`,
            data: pieData,
          },
        ]}
        width={200}
        height={100}
        tooltip={{ trigger: 'none' }}
      />
      {data.widgetId && <StreamInfo widgetId={data.widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default PieWidget;