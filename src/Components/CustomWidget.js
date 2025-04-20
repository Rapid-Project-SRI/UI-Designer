import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import './CustomWidget.css';

const CustomWidget = ({ onColorChange, onFontChange }) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedFont, setSelectedFont] = useState(null);

  const toggleColorDropdown = () => {
    setIsColorOpen(!isColorOpen);
    if (isFontOpen) setIsFontOpen(false);
  };

  const toggleFontDropdown = () => {
    setIsFontOpen(!isFontOpen);
    if (isColorOpen) setIsColorOpen(false);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (onColorChange) onColorChange(color);
  };

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    if (onFontChange) onFontChange(font);
    setIsFontOpen(false);
  };

  const fontOptions = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  return (
    <div className="custom-widget">
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleColorDropdown}>
          <span className="dropdown-label">Color</span>
          <span 
            className="color-preview" 
            style={{ backgroundColor: selectedColor }}
          />
          <span className={`arrow ${isColorOpen ? 'up' : 'down'}`} />
        </button>
        {isColorOpen && (
          <div className="dropdown-menu color-menu">
            <HexColorPicker 
              color={selectedColor} 
              onChange={handleColorChange} 
            />
            <div className="color-value">{selectedColor}</div>
          </div>
        )}
      </div>

      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleFontDropdown}>
          <span className="dropdown-label">Font</span>
          {selectedFont && (
            <span className="font-preview" style={{ fontFamily: selectedFont }}>Aa</span>
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
};

export default CustomWidget;