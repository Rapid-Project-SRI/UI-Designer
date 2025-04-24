import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/ItemTypes';
import Typography from '@mui/material/Typography';

/**
 * MUI Text Display Widget (Consumer)
 * Props: text (string), variant (string)
 * Usage: <TextDisplayWidget text="Display this" variant="body1" />
 */
const TextDisplayWidget = ({ text = 'Text', variant = 'body1', _id, name }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.WIDGET,
      id: _id,
      name: name || text
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div ref={drag} style={{ margin: 10, opacity: isDragging ? 0.5 : 1 }}>
      <Typography variant={variant} gutterBottom>
        {text}
      </Typography>
    </div>
  );
};

export default TextDisplayWidget;