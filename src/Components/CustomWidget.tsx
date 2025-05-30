import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import '../styles/CustomWidget.css';
import { designStore, Widget } from '../storage/DesignStore';
import { observer } from 'mobx-react-lite';

const CustomWidget: React.FC = observer(() => {
  const selectedWidget = designStore.widgets.find(w => designStore.selectedWidgetIds.includes(w.id));

  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  // const [labelText, setLabelText] = useState(selectedWidget.label);
  const [sizeInput, setSizeInput] = useState(selectedWidget?.style.width || 80);
  const [widgetProps, setWidgetProps] = useState<Widget | null>(selectedWidget || null);

  useEffect(() => {
    if (!selectedWidget) {
      setWidgetProps(null);
    } else {
      setWidgetProps(selectedWidget);
    }
  }, [selectedWidget]);

  if (!selectedWidget) {
    return null; // Return null to render nothing if no widget is selected
  }

  const toggleColorDropdown = () => {
    setIsColorOpen(!isColorOpen);
    if (isFontOpen) setIsFontOpen(false);
  };

  const toggleFontDropdown = () => {
    setIsFontOpen(!isFontOpen);
    if (isColorOpen) setIsColorOpen(false);
  };

  const handleColorChange = (color: string) => {
    if (!widgetProps) return;
    const editedWidget: Widget = {
      ...widgetProps, 
      style: {
        ...widgetProps.style,
        color: color
      }
    }
    setWidgetProps(editedWidget);
  };

  const handleFontSelect = (font: string) => {
    if (!widgetProps) return;
    setIsFontOpen(false);
    const editedWidget: Widget = {
      ...widgetProps, 
      style: {
        ...widgetProps.style,
        font: font
      }
    }
    setWidgetProps(editedWidget);
  };

  const fontOptions = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  const handleApply = () => {
    if (selectedWidget && widgetProps) {
      designStore.updateWidget(selectedWidget.id, widgetProps)
    }
  }

  const handleLabelChange = (newLabel: string) => {
    if (!widgetProps) return;
    const editedWidget: Widget = {
      ...widgetProps, 
      label: newLabel
    }
    setWidgetProps(editedWidget);
  };

  const isStaticImage = selectedWidget.type === 'StaticImage';

  return (
    <div className="custom-widget" style={{ overflow: 'visible', maxHeight: 'none' }}>
      <div className="property-group">
        <label>Label</label>
        <input
          type="text"
          value={widgetProps?.label || ''}
          onChange={(e) => {
            // setLabelText(e.target.value);
            handleLabelChange(e.target.value);
          }}
          className="label-input"
        />
      </div>

      <div className="property-group">
        <label>Font</label>
        <div className="dropdown-toggle" onClick={toggleFontDropdown}>
          {widgetProps?.style.font || 'Select Font'}
          <span className={`arrow ${isFontOpen ? 'up' : 'down'}`}></span>
        </div>
        {isFontOpen && (
          <div className="font-menu">
            {fontOptions.map((font) => (
              <div
                key={font}
                className="font-option"
                style={{ fontFamily: font }}
                onClick={() => handleFontSelect(font)}
              >
                {font}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color customization is disabled for StaticImage widgets */}
      {!isStaticImage && (
        <div className="property-group">
          <label>Color</label>
          <div className="dropdown-toggle" onClick={toggleColorDropdown}>
            <span className="color-preview" style={{ backgroundColor: widgetProps?.style.color }}></span>
            {widgetProps?.style.color || 'Select Color'}
            <span className={`arrow ${isColorOpen ? 'up' : 'down'}`}></span>
          </div>
          {isColorOpen && (
            <div style={{ padding: 10 }}>
              <HexColorPicker color={widgetProps?.style.color || ''} onChange={handleColorChange} />
              <div className="color-value">{widgetProps?.style.color}</div>
            </div>
          )}
        </div>
      )}

      {/* Size Control */}
      <div className="property-group">
        <label>Size</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="number"
            value={sizeInput}
            onChange={(e) => setSizeInput(Number(e.target.value))}
            placeholder="Size"
            min={10}
            style={{ width: 60 }}
          />
          <button onClick={handleApply} style={{ padding: '2px 8px', fontSize: 12 }}>Apply</button>

           {/* Delete button */}
          <button onClick={() => designStore.deleteWidget(selectedWidget.id)}
            style={{padding: '2px 8px', fontSize: 12}}>Delete</button>
        </div>
      </div>
    </div>
  );
});

export default CustomWidget;