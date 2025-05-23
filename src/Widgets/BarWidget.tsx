import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { BarChart } from '@mui/x-charts/BarChart';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { WidgetCard } from '../Components/WidgetCard';

interface BarWidgetProps {
  widgetId: string;
}

const BarWidget: React.FC<NodeProps<BarWidgetProps>> = observer(({ data }) => {
  const { widgetId } = data;
  const { label, font, width, height, fontSize } = useWidgetCustomization(widgetId);

  return (
    <WidgetCard header={label}>
      <div style={{ fontFamily: font }} className='flex flex-col items-center gap-2'>
        <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
        <BarChart
          xAxis={[{ data: ['Series 1', 'Series 2'], scaleType: 'band' }]}
          series={[
            { data: [4, 3] },
            { data: [1, 6] },
            { data: [2, 5] },
          ]}
          height={200}
          width={100}
          margin={{ top: 10, right: 0, bottom: 30, left: 0 }}

        />
        {widgetId && <StreamInfo widgetId={widgetId} />}
        <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
      </div>
    </WidgetCard>
  );
});

export default BarWidget;