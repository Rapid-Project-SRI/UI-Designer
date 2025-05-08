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

  return (
    <div className="custom-widget">
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleColorDropdown}>
          <span className="dropdown-label">Color</span>
          <span 
            className="color-preview" 
            style={{ backgroundColor: selectedWidget.style.color }}
          />
          <span className={`arrow ${isColorOpen ? 'up' : 'down'}`} />
        </button>
        {isColorOpen && (
          <div className="dropdown-menu color-menu">
            <HexColorPicker 
              color={selectedWidget.style.color} 
              onChange={handleColorChange} 
            />
            <div className="color-value">{selectedWidget.style.color}</div>
          </div>
        )}
      </div>

      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleFontDropdown}>
          <span className="dropdown-label">Font</span>
          {selectedWidget.style.font && (
            <span className="font-preview" style={{ fontFamily: selectedWidget.style.font }}>Aa</span>
          )}
          <span className={`arrow ${isFontOpen ? 'up' : 'down'}`} />
        </button>
        {isFontOpen && (
          <div className="dropdown-menu font-menu">
            {fontOptions.map((font, index) => (
              <div
                key={index}
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
    </div>
  );
});

export default CustomWidget;