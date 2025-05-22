import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

/**
 * MUI Switch Widget
 * Props: checked (bool), onChange (func), label (string)
 * Usage: <SwitchWidget checked={true} onChange={...} label="Toggle" />
 */
interface SwitchWidgetProps {
  checked?: boolean;
  onChange: () => void;
  label?: string;
  widgetId: string;
}

const SwitchWidget: React.FC<NodeProps<SwitchWidgetProps>> = observer(({ data }) => {
  const { checked = false, onChange, widgetId } = data;
  const { label: widgetLabel, font, width, fontSize } = useWidgetCustomization(widgetId);

  return (
    <div style={{ width, height: 40, border: 'none', fontFamily: font, boxSizing: 'border-box' }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        label={<span style={{ fontSize, fontFamily: font, color: '#222' }}>{widgetLabel}</span>}
      />
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
    </div>
  );
});

export default SwitchWidget;