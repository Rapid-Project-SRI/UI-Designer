import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/ItemTypes';
import Button from '@mui/material/Button';

/**
 * MUI Button Widget
 * Props: label (string), onClick (function), variant (string), color (string)
 * Usage: <ButtonWidget label="Click me" onClick={...} variant="contained" color="primary" />
 */
const ButtonWidget = ({ label = 'Button', onClick, variant = 'contained', color = 'primary', _id, name, source }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.WIDGET,
      id: _id,
      name: name || label,
      source: source || 'canvas'
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div ref={drag} style={{ margin: 10, opacity: isDragging ? 0.5 : 1 }}>
      <Button variant={variant} color={color} onClick={onClick} fullWidth>
        {label}
      </Button>
    </div>
  );
};

export default ButtonWidget;