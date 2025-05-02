import React from 'react';
import './PropertiesPopup.css';
import CustomWidget from './CustomWidget';

const PropertiesPopup = ({ title }) => {
   const handleColorChange = (color) => {
      console.log('Selected color:', color);
      // Apply color to your widget here
    };
  
    const handleFontChange = (font) => {
      console.log('Selected font:', font);
      // Apply font to your widget here
    };

   return (
      <div 
         className="properties-popup"
         style={{ maxHeight: '400px', height: 'auto' }}
      >
      <div className="properties-popup-header">
         <h3>{title} Properties</h3>
      </div>
      <div className="properties-popup-content">
         <CustomWidget 
            onColorChange={handleColorChange}
            onFontChange={handleFontChange}
         />
      </div>
      </div>
   );
};

export default PropertiesPopup;