import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { LinearProgress, Box } from '@mui/material';
import { WidgetCard } from '../Components/WidgetCard';

interface ProgressBarWidgetProps {
    value?: number;
    min?: number;
    max?: number;
    label?: string;
    widgetId: string;
}

const ProgressBarWidget: React.FC<NodeProps<ProgressBarWidgetProps>> = observer(({ data }) => {
    const { value = 50, min = 0, max = 100, widgetId } = data;
    const { style, label, font, width, fontSize, color } = useWidgetCustomization(widgetId);

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <WidgetCard header={label}>
            <div
                className='my-2'
                style={{ 
                    width: 100,
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: 10,
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 5,
                    fontFamily: 'inherit'
                }}
            >
                <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
                <div className='w-full'>
                <Box sx={{ width: '100%' }}>
                    <LinearProgress variant="determinate" value={percentage} />
                </Box>
                </div>
                {widgetId && <StreamInfo widgetId={widgetId} />}
                <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
            </div>
        </WidgetCard>
    );
});

export default ProgressBarWidget;