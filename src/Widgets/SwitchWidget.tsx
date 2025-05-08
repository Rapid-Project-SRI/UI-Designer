import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

/**
 * MUI Switch Widget
 * Props: checked (bool), onChange (func), label (string)
 * Usage: <SwitchWidget checked={true} onChange={...} label="Toggle" />
 */
interface SwitchWidgetProps {
  checked?: boolean;
  onChange: () => void;
  label?: string;
}

const SwitchWidget: React.FC<NodeProps<SwitchWidgetProps>> = ({ data }) => {
  const { checked = false, onChange, label = 'Switch' } = data;

  return (
    <div style={{ margin: 10, background: 'transparent', border: 'none' }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        label={label}
      />
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default SwitchWidget;