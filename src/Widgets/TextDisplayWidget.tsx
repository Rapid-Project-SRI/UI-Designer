import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Typography from '@mui/material/Typography';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

/**
 * MUI Text Display Widget (Consumer)
 * Props: text (string), variant (string)
 * Usage: <TextDisplayWidget text="Display this" variant="body1" />
 */
interface TextDisplayWidgetProps {
  text?: string;
  variant?: 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  widgetId: string;
}

const TextDisplayWidget: React.FC<NodeProps<TextDisplayWidgetProps>> = observer(({ data }) => {
  const { text = '', variant = 'body1', widgetId } = data;
  const { label, font, width, fontSize } = useWidgetCustomization(widgetId);

  return (
    <div style={{ width, height: 40, border: 'none', fontFamily: font, boxSizing: 'border-box' }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      <Typography variant={variant} gutterBottom style={{ fontSize, color: '#222', fontFamily: font }}>
        {label || text}
      </Typography>
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
    </div>
  );
});

export default TextDisplayWidget;