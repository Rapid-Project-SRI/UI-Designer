import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import Draggable from 'react-draggable';
import ButtonWidget from '../Widgets/ButtonWidget';
import SwitchWidget from '../Widgets/SwitchWidget';
import GaugeWidget from '../Widgets/GaugeWidget';
import TextDisplayWidget from '../Widgets/TextDisplayWidget';
import { ItemTypes } from './ItemTypes';
import WidgetPanel from './WidgetPanel';
import './Content.css';
import { GitBranch } from 'lucide-react';
import LineWidget from '../Widgets/LineWidget';
import BarWidget from '../Widgets/BarWidget';
import PieWidget from '../Widgets/PieWidget';
import { useSocketData } from '../hooks/useSocketData';
import PropertiesPopup from './PropertiesPopup';

const Content = (props) => {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);

  const barData = useSocketData('topic_bar_data');
  const lineData = useSocketData('topic_line_data');

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvas = document.getElementById('canvas');
      const canvasRect = canvas.getBoundingClientRect();

      const newWidget = {
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top,
        color: '#ffffff', // Standardfarbe
        font: 'Arial', // Standardfont
        width: 100,
        height: 50
      };

      setWidgets((prev) => {
        props.change([...prev, newWidget]);
        return [...prev, newWidget];
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  const widgetRefs = useRef({}); // Store refs for all widgets

  const handleWidgetClick = (widget) => {
    const widgetElement = widgetRefs.current[widget.id];
    if (widgetElement) {
      const { offsetWidth, offsetHeight } = widgetElement; // Get the actual dimensions
      setSelectedWidget({
        ...widget,
        width: offsetWidth,
        height: offsetHeight
      });
    }
  };

  const handleClosePanel = () => {
    setSelectedWidget(null);
  };

  const updateWidgetPosition = (id, x, y) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const updateWidgetStyle = (id, changes) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...changes } : w))
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <div
        id="canvas"
        ref={drop}
        style={{
          width: '100%',
          height: '800px',
          border: '2px dashed #ccc',
          position: 'relative',
          flex: 1,
          background: isOver ? '#f0f8ff' : 'white'
        }}
        onClick={(e) => { // will deselect a selected widget if the canvas is clicked
          if (e.target === e.currentTarget) {
            handleClosePanel();
          }
        }}
      >
        {/* Map widget names to components for clean, generic rendering */}
        {widgets.map((widget) => {
          const widgetMap = {
            Line: <LineWidget chartData={lineData}/>,
            Bar: <BarWidget chartData={barData}/>,
            Pie: <PieWidget />,
            Button: <ButtonWidget />,
            Switch: <SwitchWidget />,
            Gauge: <GaugeWidget />,
            TextDisplay: <TextDisplayWidget />
          };
          const WidgetComponent = widgetMap[widget.name];
          return (
            <Draggable
              key={widget.id}
              bounds="parent"
              position={{ x: widget.x, y: widget.y }}
              onStop={(e, data) => updateWidgetPosition(widget.id, data.x, data.y)}
            >
              <div
                ref={(el) => (widgetRefs.current[widget.id] = el)} // Assign the ref
                onClick={() => handleWidgetClick(widget)}
                style={{
                  position: 'absolute',
                  cursor: 'move',
                  border: selectedWidget?.id === widget.id ? '2px solid #1890ff' : 'none',
                  borderRadius: '4px',
                  padding: '4px',
                  backgroundColor: widget.color || '#ffffff',
                  fontFamily: widget.font || 'Arial'
                }}
              >
                {WidgetComponent || null}
              </div>
            </Draggable>
          );
          })}
          {selectedWidget && (
            <div
              style={{
                position: 'absolute',
                left: `${selectedWidget.x + selectedWidget.width + 10}px`, // Position the popup to the right of the widget
                top: `${selectedWidget.y}px`, // Align the popup vertically with the widget
                zIndex: 1000
              }}
            >
              <PropertiesPopup
                title={selectedWidget.name}
                height={selectedWidget.height}
              />
            </div>
          )}
      </div>


      {selectedWidget && (
        <WidgetPanel
          onClose={handleClosePanel}
          widgetName={selectedWidget.name}
          CustomWidgetProps={{
            onColorChange: (color) =>
              updateWidgetStyle(selectedWidget.id, { color }),
            onFontChange: (font) =>
              updateWidgetStyle(selectedWidget.id, { font })
          }}
        />
      )}
    </div>
  );
};

export default Content;