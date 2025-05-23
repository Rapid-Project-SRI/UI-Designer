import React from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import StreamInfo from './StreamInfo';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { WidgetCard } from '../Components/WidgetCard';

/**
 * MUI Switch Widget
 * Props: checked (bool), onChange (func), label (string)
 * Usage: <SwitchWidget checked={true} onChange={...} label="Toggle" />
 */
interface SwitchWidgetProps {
  checked?: boolean;
  onChange: () => void;
  label?: string;
  widgetId: string;
}

const SwitchWidget: React.FC<NodeProps<SwitchWidgetProps>> = observer(({ data }) => {
  const { checked = false, onChange, widgetId } = data;
  const { label: widgetLabel, font, width, fontSize } = useWidgetCustomization(widgetId);

  return (
    <WidgetCard header={widgetLabel}>
      <div style={{ fontFamily: font }} className='flex flex-col items-center gap-2'>
        <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
        <FormControlLabel
          control={<Switch checked={checked} onChange={onChange} />}
          label={<p>Switch</p>}
        />
        {widgetId && <StreamInfo widgetId={widgetId} />}
        <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
      </div>
    </WidgetCard>
  );
});

export default SwitchWidget;