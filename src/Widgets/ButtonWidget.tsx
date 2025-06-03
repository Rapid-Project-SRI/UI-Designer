import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Button from '@mui/material/Button';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { WidgetCard } from '../Components/WidgetCard';

/**
 * Button Widget Props to pass into ButtonWidget
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

/**
 * Button widget that allows the user to click as well as customize.
 * @param {NodeProps<ButtonWidgetProps>} data - Contains label, onClick, and other node data for customization.
 * @returns {WidgetCard} A rendered button widget with customization and flow handles.
 */
const ButtonWidget: React.FC<NodeProps<ButtonWidgetProps>> = observer(({ data }) => {
  const { onClick, variant = 'contained', widgetId } = data;
  const { label, font, width, height, fontSize, color } = useWidgetCustomization(widgetId);

  return (
    <WidgetCard header={label}>
      <div style={{ fontFamily: font }} className='flex flex-col items-center gap-2'>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      <div className='m-3'>
        <Button
        className='rounded-lg'
        variant={variant}
        style={{ backgroundColor: color, fontSize: "inherit", fontFamily: font }}
        onClick={onClick}
      >
        {label}
      </Button>
      </div>
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
    </div>
    </WidgetCard >
  );
});

export default ButtonWidget;