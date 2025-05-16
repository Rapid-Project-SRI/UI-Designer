import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Typography from '@mui/material/Typography';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

interface TextBoxWidgetProps {
    text?: [];
    variant?: 'body1' | 'body2' | 'caption' | 'button' | 'overline';
    widgetId: string;
}

const TextBoxWidget: React.FC<NodeProps<TextBoxWidgetProps>> = observer(({ data }) => {
    const { text = ["string1", "string2", "string3", "string4", "string5", "string6"], variant = 'body1', widgetId } = data;
    const { label, font, width, fontSize } = useWidgetCustomization(widgetId);

    while (text.length > 4) {
        text.shift()
    }

    return (
    <div style={{ margin: 10, background: 'transparent', border: 'none', display: 'inline-block', width, fontFamily: font }}>
        <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
        <Typography variant={variant} gutterBottom style={{ fontSize, color: '#222', fontFamily: font }}>
        {text.map((item, index) => (
            <div key={index}>{item}</div>
        )) || label}
        </Typography>
        {widgetId && <StreamInfo widgetId={widgetId} />}
        <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
    );
    });

export default TextBoxWidget;