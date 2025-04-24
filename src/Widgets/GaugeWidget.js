import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Components/ItemTypes';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

/**
 * Gauge Widget (Consumer) using react-circular-progressbar
 * Props: value (number), min (number), max (number), label (string)
 * Usage: <GaugeWidget value={60} min={0} max={100} label="Speed" />
 */
const GaugeWidget = ({ value = 50, min = 0, max = 100, label = 'Gauge', _id, name }) => {
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
  // Normalize value between 0-100 for the progress bar
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div ref={drag} style={{ width: 80, margin: '0 auto', textAlign: 'center', opacity: isDragging ? 0.5 : 1 }}>
      <CircularProgressbar
        value={percentage}
        text={`${value}`}
        styles={buildStyles({
          textSize: '24px',
          pathColor: '#1976d2',
          textColor: '#222',
          trailColor: '#eee',
        })}
      />
      <div style={{ marginTop: 8, fontSize: 14 }}>{label}</div>
    </div>
  );
};

export default GaugeWidget;