import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Button from '@mui/material/Button';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

/**
 * MUI Button Widget
 * Props: label (string), onClick (function), variant (string), color (string)
 * Usage: <ButtonWidget label="Click me" onClick={...} variant="contained" color="primary" />
 */
interface ButtonWidgetProps {
  label?: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  widgetId: string;
}

const ButtonWidget: React.FC<NodeProps<ButtonWidgetProps>> = observer(({ data }) => {
  const { onClick, variant = 'contained', widgetId } = data;
  const { label, font, width, fontSize, color } = useWidgetCustomization(widgetId);

  return (
    <div style={{ margin: 10, background: 'transparent', border: 'none', display: 'inline-block', width, fontFamily: font }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <Button
        variant={variant}
        style={{ backgroundColor: color, fontSize, color: '#222', fontFamily: font }}
        onClick={onClick}
        fullWidth
      >
        {label}
      </Button>
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
});

export default ButtonWidget;