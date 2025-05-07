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
import Button from '@mui/material/Button';


const Content = (props) => {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [fileData, setFileData] = useState(null); // Filtered or modified file data
  const [originalFileData, setOriginalFileData] = useState(null); // Preserve the original uploaded file data

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
        height: offsetHeight,
        stream: widget.stream || null, // Load the stream
        selectedNode: widget.selectedNode || null // Load the selected node
      });
    }
  };

  const handleNodeSelect = (node) => {
    if (selectedWidget) {
      // Update the selected widget with the new node
      setWidgets((prev) =>
        prev.map((w) =>
          w.id === selectedWidget.id
            ? { ...w, selectedNode: node.id, stream: node } // Persist the selected node and stream
            : w
        )
      );

      // Update the selectedWidget state to reflect the new association
      setSelectedWidget((prev) => ({
        ...prev,
        selectedNode: node.id,
        stream: node // Update the stream property in the selectedWidget state
      }));
    }
  };

  const handleClosePanel = () => {
    setSelectedWidget(null);
  };

  const handleFileLoad = ({ originalFileData: original, fileData: filtered }) => {
    setOriginalFileData(original); // Store the original file data
    setFileData(filtered); // Store the filtered file data
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

  const saveDesign = () => {
    if (!originalFileData) {
      alert('No file uploaded. Please upload a JSON file first.');
      return;
    }

    // Merge the original file data with the widgets
    const designData = {
      ...originalFileData, // Use the original file data
      widgets: widgets.map((widget) => ({
        id: widget.id,
        name: widget.name,
        x: widget.x,
        y: widget.y,
        color: widget.color,
        font: widget.font,
        selectedNode: widget.selectedNode || null // Include the ID of the connected node
      }))
    };

    const dataStr = JSON.stringify(designData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation.json';
    a.click();

    URL.revokeObjectURL(url);

    alert('Saved current UI design as JSON.');
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
              />
            </div>
          )}
      </div>


      {selectedWidget && (
        <WidgetPanel
          onClose={handleClosePanel}
          widgetName={selectedWidget.name}
          fileData={fileData} // Pass filtered or modified file data to WidgetPanel
          onFileLoad={handleFileLoad} // Pass file load handler
          CustomWidgetProps={{
            onColorChange: (color) =>
              updateWidgetStyle(selectedWidget.id, { color }),
            onFontChange: (font) =>
              updateWidgetStyle(selectedWidget.id, { font })
          }}
          onNodeSelect={handleNodeSelect} // Pass the node selection handler
          selectedNode={selectedWidget.selectedNode} // Pass the selected node to the WidgetPanel
        />
      )}

      <Button variant="contained" onClick={saveDesign} style={{ position: 'absolute', bottom: 0, right: 20 }}>
        Download simulation
      </Button>
    </div>
  );
};

export default Content;