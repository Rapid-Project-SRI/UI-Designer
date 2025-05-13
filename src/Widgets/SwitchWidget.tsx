import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import StreamInfo from './StreamInfo';

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

const SwitchWidget: React.FC<NodeProps<SwitchWidgetProps>> = ({ data }) => {
  const { checked = false, onChange, label = 'Switch' } = data;

  return (
    <div style={{ margin: 10, background: 'transparent', paddingRight: 40, border: 'none', display: 'inline-block' }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        label={label}
      />
      {data.widgetId && <StreamInfo widgetId={data.widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default SwitchWidget;