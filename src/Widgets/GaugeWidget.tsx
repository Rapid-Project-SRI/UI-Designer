import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';

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
  widgetId: string;
}

// Convert the GaugeWidget to a React Flow node component
const GaugeWidget: React.FC<NodeProps<GaugeWidgetProps>> = observer(({ data }) => {
  const { value = 50, min = 0, max = 100, widgetId } = data;
  const { style, label, font, width, fontSize, color } = useWidgetCustomization(widgetId);

  // Normalize value between 0-100 for the progress bar
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div 
      style={{ 
        width,
        margin: '0 auto',
        textAlign: 'center',
        padding: 10,
        background: 'transparent',
        border: 'none',
        borderRadius: style.borderRadius || 5,
        fontFamily: font,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <CircularProgressbar
        value={percentage}
        text={`${value}`}
        styles={buildStyles({
          textSize: '24px',
          pathColor: color,
          textColor: '#222',
          trailColor: '#eee',
        })}
      />
      <div style={{
        marginTop: 8,
        fontSize,
        color: '#222',
        fontFamily: font,
      }}>
        {label}
      </div>
      {widgetId && <StreamInfo widgetId={widgetId} />}
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
});

export default GaugeWidget;