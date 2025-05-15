import React, { useRef, useState } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { useWidgetCustomization } from '../hooks/useWidgetCustomization';
import { observer } from 'mobx-react-lite';
import { designStore } from '../storage/DesignStore';

interface StaticImageWidgetProps {
  imageUrl?: string;
  widgetId: string;
}


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
    <div
      style={{ margin: 10, background: 'transparent', border: 'none', width, fontFamily: font, textAlign: 'center', minHeight: 120 }}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <Handle type="target" position={Position.Top} style={{ display: 'none' }} />
      <div style={{ fontSize, color: '#222', fontFamily: font, marginBottom: 4 }}>{label}</div>
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
      <Handle type="source" position={Position.Bottom} style={{ display: 'none' }} />
    </div>
  );
});

export default StaticImageWidget;
