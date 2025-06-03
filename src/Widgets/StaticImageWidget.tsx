// TODO: Static Image does not work in the Simulator. 

import React, { useRef, useState } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { designStore } from '../storage/DesignStore';
import { WidgetCard } from '../Components/WidgetCard';

/**
 * Static Image widget props to pass into StaticImageWidget
 * Props: imageUrl (string), widgetId (string)
 * Usage: <img src={imageUrl} />
 */
interface StaticImageWidgetProps {
  imageUrl?: string;
  widgetId: string;
}

/**
 * Static Image Widget that allows the user to upload an image into their UI design.
 * @param {NodeProps<StaticImageWidgetProps>} data - Contains value, label, and other node data for customization.
 * @returns {WidgetCard} A rendered progress bar widget with customization and flow handles.
 */
const StaticImageWidget: React.FC<NodeProps<StaticImageWidgetProps>> = observer(({ data }) => {
  const { widgetId } = data;
  const widget = designStore.widgets.find(w => w.id === widgetId);
  const imageUrl = widget?.imageUrl;
  const { label, font, width, fontSize } = useWidgetCustomization(widgetId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          designStore.updateWidgetImage(widgetId, event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * Defines what should be done when a file is uploaded
   * @param e - onChange which is called when user uploads an image
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          designStore.updateWidgetImage(widgetId, event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <WidgetCard header={label}>
      <div
        style={{ fontFamily: font }} className='flex flex-col items-center gap-2'
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }} />
        ) : (
          <div style={{ padding: 16, border: '2px dashed #aaa', borderRadius: 8, cursor: 'pointer', background: '#fafafa' }}
            onClick={() => fileInputRef.current?.click()}>
            <div>Drop image here or <span style={{ color: '#1976d2', textDecoration: 'underline' }}>upload</span></div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        )}
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none', width: 10, height: 10, background: 'transparent' }} />
      </div>
    </WidgetCard>
  );
});

export default StaticImageWidget;
