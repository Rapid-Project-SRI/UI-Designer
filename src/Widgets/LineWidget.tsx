// TODO: Live data not implemented

import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { LineChart } from '@mui/x-charts/LineChart';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { WidgetCard } from '../Components/WidgetCard';

/**
 * Line Widget Props to pass into LineWidget
 * Props: chartData ({dataset}), widgetId(string)
 * Usage: <LineChart ... series={[{data}]} .../>
 */
interface LineWidgetProps {
  chartData: { datasets: { data: number[] }[] };
  widgetId: string;
}

/**
 * Line chart widget that displays the given live data. 
 * @param {NodeProps<LineWidgetProps>} data - Contains widgetId and other node data for customization.
 * @returns {WidgetCard} A rendered line chart widget with customization and flow handles.
 */
const LineWidget: React.FC<NodeProps<LineWidgetProps>> = observer(({ data }) => {
  const { chartData, widgetId } = data;
  const { label, font, width, fontSize } = useWidgetCustomization(widgetId);

  return (
    <WidgetCard header={label}>
      <div style={{ fontFamily: font }} className='flex flex-col items-center gap-2'>
        <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          height={300}
          width={300}
        />
        {widgetId && <StreamInfo widgetId={widgetId} />}
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      </div>
    </WidgetCard>
  );
});

export default LineWidget;