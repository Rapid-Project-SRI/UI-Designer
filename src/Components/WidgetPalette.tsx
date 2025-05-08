import React from 'react';
import { WidgetType } from '../DesignStore';

function WidgetPalette() {
  // When dragging starts, store the widget type in the dataTransfer object.
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, widgetType: WidgetType) => {
    event.dataTransfer.setData('application/reactflow', widgetType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ padding: 10, background: '#f7f7f7', height: '100%', borderRight: '1px solid #ddd' }}>
      <div style={{ marginBottom: 10, fontWeight: 'bold' }}>Widgets</div>
      <div
        style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'Button')}
        draggable
      >
        Button Widget
      </div>
      <div
        style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'Gauge')}
        draggable
      >
        Gauge Widget
      </div>
      <div
        style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'Line')}
        draggable
      >
        Line Widget
      </div>
      <div
        style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'Pie')}
        draggable
      >
        Pie Widget
      </div>
      <div
        style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'Switch')}
        draggable
      >
        Switch Widget
      </div>
      <div
        style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'TextDisplay')}
        draggable
      >
        Text Display Widget
      </div>
      <div
        style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'Bar')}
        draggable
      >
        Bar Widget
      </div>
    </aside>
  );
}

export default WidgetPalette;
