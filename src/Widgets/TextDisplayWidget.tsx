import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Typography from '@mui/material/Typography';
import StreamInfo from './StreamInfo';

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

const TextDisplayWidget: React.FC<NodeProps<TextDisplayWidgetProps>> = ({ data }) => {
  const { text = 'Text', variant = 'body1' } = data;

  return (
    <div style={{ margin: 10, background: 'transparent', paddingRight: 40, border: 'none', display: 'inline-block' }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <Typography variant={variant} gutterBottom>
        {text}
      </Typography>
      {data.widgetId && <StreamInfo widgetId={data.widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default TextDisplayWidget;