import React from 'react';
import './WidgetPanel.css';
import FileUploader from './FileUploader';

const WidgetPanel = ({ onClose, widgetName }) => {
  return (
    <div className="widget-panel-sidebar">
      <div className="sidebar-header">
        <h3>{widgetName} Settings</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="sidebar-content">
        <div className="tab-content">
          <FileUploader widgetName={widgetName} />
        </div>
      </div>
    </div>
  );
};

export default WidgetPanel;