import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import '../styles/CustomWidget.css';
import { designStore, Widget } from '../storage/DesignStore';
import { observer } from 'mobx-react-lite';

interface CustomWidgetProps {
  selectedWidget: Widget
}

const CustomWidget: React.FC<CustomWidgetProps> = observer(({ selectedWidget }) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [labelText, setLabelText] = useState(selectedWidget.label);
  const [sizeInput, setSizeInput] = useState(selectedWidget.style.width || 80);

  const toggleColorDropdown = () => {
    setIsColorOpen(!isColorOpen);
    if (isFontOpen) setIsFontOpen(false);
  };

  const toggleFontDropdown = () => {
    setIsFontOpen(!isFontOpen);
    if (isColorOpen) setIsColorOpen(false);
  };

  const handleColorChange = (color: string) => {
    if (selectedWidget) {
      designStore.updateWidgetColor(selectedWidget.id, color);
    }
  };

  const handleFontSelect = (font: string) => {
    setIsFontOpen(false);
    if (selectedWidget) {
      designStore.updateWidgetFont(selectedWidget.id, font);
    }
  };

  const fontOptions = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  // Proportional scaling
  const handleApplySize = () => {
    if (selectedWidget) {
      const aspectRatio = (selectedWidget.style.height || 80) / (selectedWidget.style.width || 80);
      const newWidth = Number(sizeInput);
      const newHeight = Math.round(newWidth * aspectRatio);
      designStore.updateWidgetSize(selectedWidget.id, newWidth, newHeight);
    }
  };

  const handleLabelChange = (newLabel: string) => {
    if (selectedWidget) {
      designStore.updateWidgetLabel(selectedWidget.id, newLabel);
    }
  };

  const isStaticImage = selectedWidget.type === 'StaticImage';

  return (
    <div className="custom-widget" style={{ overflow: 'visible', maxHeight: 'none' }}>
      <div className="property-group">
        <label>Label</label>
        <input
          type="text"
          value={labelText}
          onChange={(e) => {
            setLabelText(e.target.value);
            handleLabelChange(e.target.value);
          }}
          className="label-input"
        />
      </div>

      <div className="property-group">
        <label>Font</label>
        <div className="dropdown-toggle" onClick={toggleFontDropdown}>
          {selectedWidget.style.font || 'Select Font'}
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
            <span className="color-preview" style={{ backgroundColor: selectedWidget.style.color }}></span>
            {selectedWidget.style.color || 'Select Color'}
            <span className={`arrow ${isColorOpen ? 'up' : 'down'}`}></span>
          </div>
          {isColorOpen && (
            <div style={{ padding: 10 }}>
              <HexColorPicker color={selectedWidget.style.color} onChange={handleColorChange} />
              <div className="color-value">{selectedWidget.style.color}</div>
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
          <button onClick={handleApplySize} style={{ padding: '2px 8px', fontSize: 12 }}>Enter</button>

           {/* Delete button */}
          <button onClick={() => designStore.deleteWidget(selectedWidget.id)}
            style={{padding: '2px 8px', fontSize: 12}}>Delete</button>
        </div>
      </div>
    </div>
  );
});

export default CustomWidget;