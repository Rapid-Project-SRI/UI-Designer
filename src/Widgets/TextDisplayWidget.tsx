import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Typography from '@mui/material/Typography';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { WidgetCard } from '../Components/WidgetCard';

/**
 * MUI Text Display Widget (Consumer)
 * Props: text (string), variant (string)
 * Usage: <Typography>{text}</Typography>
 */
interface TextDisplayWidgetProps {
  text?: string;
  variant?: 'body1' | 'body2' | 'caption' | 'button' | 'overline';
  widgetId: string;
}

/**
 * TextDisplay widget that shows the given text
 * @param {NodeProps<TextDisplayWidgetProps>} data - Contains text, label, and other node data for customization.
 * @returns {WidgetCard} A rendered text display widget with customization and flow handles.
 */
const TextDisplayWidget: React.FC<NodeProps<TextDisplayWidgetProps>> = observer(({ data }) => {
  const { text = '', variant = 'body1', widgetId } = data;
  const { label, font, width, fontSize } = useWidgetCustomization(widgetId);

  return (
    <WidgetCard header={label}>
      <div style={{ 
      margin: 10, 
      background: 'transparent', 
      border: 'none', 
      display: 'inline-block', 
      width: 150,
      fontFamily: 'inherit'
    }} className='flex flex-col items-center gap-2'>
        <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
        <Typography variant={variant} 
          gutterBottom 
          style={{ 
            fontSize: 15, 
            color: '#222',
            fontFamily: 'inherit'
          }}>
          Example Text
        </Typography>
        {widgetId && <StreamInfo widgetId={widgetId} />}
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      </div>
    </WidgetCard>
  );
});

export default TextDisplayWidget;