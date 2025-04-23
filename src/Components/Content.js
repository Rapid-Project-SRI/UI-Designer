import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Draggable from 'react-draggable';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import PieChart from '../Charts/PieChart';
import { ItemTypes } from './ItemTypes';
import WidgetPanel from './WidgetPanel';
import './Content.css';
import {useSocketData } from '../hooks/useSocketData';

const Content = (props) => {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);

  // Socket data from backend
  const barData = useSocketData('topic_bar_data');
  const lineData = useSocketData('topic_line_data');  // ther is no real data for now
  const pieData = useSocketData('topic_pie_data');    // ther is no real data for now

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
        color: '#ffffff',
        font: 'Arial'
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

  const handleWidgetClick = (widget) => {
    setSelectedWidget(widget);
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

  const renderWidget = (widget) => {
    const chartProps = {
      Bar: <BarChart chartData={barData} />
    };

    return (
      <Draggable
        key={widget.id}
        bounds="parent"
        position={{ x: widget.x, y: widget.y }}
        onStop={(e, data) => updateWidgetPosition(widget.id, data.x, data.y)}
      >
        <div
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
          {chartProps[widget.name] || <div>Unknown Widget</div>}
        </div>
      </Draggable>
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
      >
        {widgets.map((widget) => renderWidget(widget))}
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
