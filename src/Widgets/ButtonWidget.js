import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/ItemTypes';
import Button from '@mui/material/Button';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

/**
 * MUI Button Widget
 * Props:
 * - label (string)
 * - topic (string) → the socket topic to emit to
 * - payload (any) → the data to emit
 * - variant (string), color (string)
 */
const ButtonWidget = ({
  label = 'Button',
  topic,
  payload = 'clicked', // default value
  variant = 'contained',
  color = 'primary',
  _id,
  name
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.WIDGET,
      id: _id,
      name: name || label
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    if (topic) {
      console.log(`Emitting to topic "${topic}":`, payload);
      socket.emit(topic, payload);
    } else {
      console.warn('No topic provided for ButtonWidget');
    }
  };

  return (
    <div ref={drag} style={{ margin: 10, opacity: isDragging ? 0.5 : 1 }}>
      <Button variant={variant} color={color} onClick={handleClick} fullWidth>
        {label}
      </Button>
    </div>
  );
};

export default ButtonWidget;
