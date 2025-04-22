import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/ItemTypes';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

/**
 * MUI Switch Widget
 * Props: checked (bool), onChange (func), label (string)
 * Usage: <SwitchWidget checked={true} onChange={...} label="Toggle" />
 */
const SwitchWidget = ({ checked = false, onChange, label = 'Switch', _id, name }) => {
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
  return (
    <div ref={drag} style={{ margin: 10, opacity: isDragging ? 0.5 : 1 }}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        label={label}
      />
    </div>
  );
};

export default SwitchWidget;
