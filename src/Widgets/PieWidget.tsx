import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { PieChart } from '@mui/x-charts/PieChart';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { WidgetCard } from '../Components/WidgetCard';

interface PieWidgetProps {
  data?: { id: number; value: number }[];
  widgetId: string;
}

const MOCK_DATA = [
  { id: 0, value: 40 },
  { id: 1, value: 30 },
  { id: 2, value: 30 },
];

const PieWidget: React.FC<NodeProps<PieWidgetProps>> = observer(({ data }) => {
  const { data: pieData, widgetId } = data;
  const { label, font, width = 120, fontSize, color } = useWidgetCustomization(widgetId);

  // Use mock data if no data is provided or it's empty
  const chartData = (pieData && Array.isArray(pieData) && pieData.length > 0) ? pieData : MOCK_DATA;

  return (
    <WidgetCard header={label}>
      <div style={{ fontFamily: font }} className='flex flex-col items-center gap-2'>
        <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: 'series A' },
                { id: 1, value: 15, label: 'series B' },
                { id: 2, value: 20, label: 'series C' },
              ],
            },
          ]}
          width={200}
          height={100}
          margin={{ top: 10, right: 120, bottom: 10, left: 10 }}
        />
        {widgetId && <StreamInfo widgetId={widgetId} />}
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      </div>
    </WidgetCard>
  );
});

export default PieWidget;