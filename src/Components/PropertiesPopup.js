import React from 'react';
import './PropertiesPopup.css';

const PropertiesPopup = ({ title, children, height }) => {
   return (
      <div 
         className="properties-popup"
         style={{ height: height || 'auto' }}
      >
      <div className="properties-popup-header">
         <h3>{title} Properties</h3>
      </div>
      <div className="properties-popup-content">
         {children}
      </div>
      </div>
   );
};

export default PropertiesPopup;