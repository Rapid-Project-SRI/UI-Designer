import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { designStore } from '../storage/DesignStore';

import { observer } from 'mobx-react-lite';
import { WidgetCard } from '../Components/WidgetCard';
import PropertiesPopup from '../Components/PropertiesPopup';

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
  <WidgetCard header={label}>
    <div style={{ width: "80px" }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      <div style={{ font, fontSize }}>
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
        {widgetId && <StreamInfo widgetId={widgetId} />}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
    </div>
    </WidgetCard>
  );
});

export default GaugeWidget;