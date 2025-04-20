import React, { useState } from 'react';
import './WidgetPanel.css';
import FileUploader from './FileUploader';
import CustomWidget from './CustomWidget';

const WidgetPanel = ({ onClose, widgetName }) => {
  const [activeTab, setActiveTab] = useState('custom');

  const handleColorChange = (color) => {
    console.log('Selected color:', color);
    // Apply color to your widget here
  };

  const handleFontChange = (font) => {
    console.log('Selected font:', font);
    // Apply font to your widget here
  };

  return (
    <div className="widget-panel-sidebar">
      <div className="sidebar-header">
        <h3>{widgetName} Settings</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="sidebar-tabs">
        <button 
          className={activeTab === 'custom' ? 'active' : ''}
          onClick={() => setActiveTab('custom')}
        >
          Custom Widget
        </button>
        <button 
          className={activeTab === 'connect' ? 'active' : ''}
          onClick={() => setActiveTab('connect')}
        >
          Connect Stream
        </button>
      </div>
      <div className="sidebar-content">
        {activeTab === 'custom' ? (
          <div className="tab-content">
            <CustomWidget 
              onColorChange={handleColorChange}
              onFontChange={handleFontChange}
            />
          </div>
        ) : (
          <div className="tab-content">
            <FileUploader widgetName={widgetName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetPanel;