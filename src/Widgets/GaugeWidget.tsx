import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

/**
 * Gauge Widget (Consumer) using react-circular-progressbar
 * Props: value (number), min (number), max (number), label (string)
 * Usage: <GaugeWidget value={60} min={0} max={100} label="Speed" />
 */

// Define the props for the GaugeWidget
interface GaugeWidgetProps {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
}

// Convert the GaugeWidget to a React Flow node component
const GaugeWidget: React.FC<NodeProps<GaugeWidgetProps>> = ({ data }) => {
  const { value = 50, min = 0, max = 100, label = 'Gauge' } = data;

  // Normalize value between 0-100 for the progress bar
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ width: 80, margin: '0 auto', textAlign: 'center', padding: 10, background: 'transparent', border: 'none', borderRadius: 5 }}>
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
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
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
};

export default GaugeWidget;