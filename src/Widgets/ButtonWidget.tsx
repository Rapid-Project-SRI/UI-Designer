import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Button from '@mui/material/Button';

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
}

const ButtonWidget: React.FC<NodeProps<ButtonWidgetProps>> = ({ data }) => {
  const { label = 'Button', onClick, variant = 'contained', color = 'primary' } = data;

  return (
    <div style={{ margin: 10, background: 'transparent', border: 'none' }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <Button variant={variant} color={color as any} onClick={onClick} fullWidth>
        {label}
      </Button>
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default ButtonWidget;