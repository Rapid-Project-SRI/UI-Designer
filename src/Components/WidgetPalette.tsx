import React, { useState } from 'react';
import { WidgetType } from '../storage/DesignStore';

function WidgetPalette() {
  const [isInteractiveOpen, setIsInteractiveOpen] = useState(false);
  const [isDisplayDataOpen, setIsDisplayDataOpen] = useState(false);
  const [isStaticOpen, setIsStaticOpen] = useState(false);

  // When dragging starts, store the widget type in the dataTransfer object.
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, widgetType: WidgetType) => {
    event.dataTransfer.setData('application/reactflow', widgetType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ padding: 10, background: '#f7f7f7', height: '100%', borderRight: '1px solid #ddd' }}>
      <div style={{ marginBottom: 10, fontWeight: 'bold' }}>Widgets</div>

      <div>
        <button onClick={() => setIsInteractiveOpen(!isInteractiveOpen)} style={{ width: '100%', textAlign: 'left' }}>
          Interactive {isInteractiveOpen ? '▲' : '▼'}
        </button>
        {isInteractiveOpen && (
          <div style={{ paddingLeft: 10 }}>
            <div
              style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
              onDragStart={(event) => onDragStart(event, 'Button')}
              draggable
            >
              Button Widget
            </div>
            <div
              style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
              onDragStart={(event) => onDragStart(event, 'Switch')}
              draggable
            >
              Switch Widget
            </div>
          </div>
        )}
      </div>

      <div>
        <button onClick={() => setIsDisplayDataOpen(!isDisplayDataOpen)} style={{ width: '100%', textAlign: 'left' }}>
          Display Data {isDisplayDataOpen ? '▲' : '▼'}
        </button>
        {isDisplayDataOpen && (
          <div style={{ paddingLeft: 10 }}>
            <div
              style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
              onDragStart={(event) => onDragStart(event, 'Gauge')}
              draggable
            >
              Gauge Widget
            </div>
            <div
              style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
              onDragStart={(event) => onDragStart(event, 'ProgressBar')}
              draggable
            >
              Progress Bar Widget
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
              onDragStart={(event) => onDragStart(event, 'TextDisplay')}
              draggable
            >
              Text Display Widget
            </div>
            <div
              style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
              onDragStart={(event) => onDragStart(event, 'TextBox')}
              draggable
            >
              Text Box Widget
            </div>
            <div
              style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
              onDragStart={(event) => onDragStart(event, 'Bar')}
              draggable
            >
              Bar Widget
            </div>
          </div>
        )}
      </div>

      {/* Static Dropdown */}
      <div>
        <button onClick={() => setIsStaticOpen(!isStaticOpen)} style={{ width: '100%', textAlign: 'left' }}>
          Static {isStaticOpen ? '▲' : '▼'}
        </button>
        {isStaticOpen && (
          <div style={{ paddingLeft: 10 }}>
            <div
              style={{ marginBottom: 5, padding: 8, background: '#ddd', cursor: 'grab' }}
              onDragStart={(event) => onDragStart(event, 'StaticImage')}
              draggable
            >
              Static Image Widget
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default WidgetPalette;
