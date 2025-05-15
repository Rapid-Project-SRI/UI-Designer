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
    <div style={{ margin: 10, background: 'transparent', border: 'none', display: 'inline-block', width, fontFamily: font }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        label={<span style={{ fontSize, fontFamily: font, color: '#222' }}>{widgetLabel}</span>}
      />
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
});

export default SwitchWidget;