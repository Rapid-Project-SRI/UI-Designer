import React, { useState } from 'react';
import './WidgetPanel.css';
import FileUploader from './FileUploader';

const WidgetPanel = ({ onClose, widgetName }) => {
  const [fileData, setFileData] = useState(null);

  const handleFileLoad = (data) => {
    setFileData(data);
  };

  const handleClear = () => {
    setFileData(null);
  };

  return (
    <div className="widget-panel-sidebar">
      <div className="sidebar-header">
        <h3>Connect stream</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="sidebar-content">
        {!fileData ? (
          <FileUploader onFileLoad={handleFileLoad} />
        ) : (
          <div>
            <div className="file-name-bar">
              <span>{fileData.fileName}</span>
              <button className="clear-button" onClick={handleClear}>✕</button>
            </div>

            {fileData.outputNodes.map((node) => (
              <div className="node-box output" key={node.id}>
                <div className="node-header">
                  <span className="node-icon">E</span>
                  <span className="node-title">Output Stream</span>
                  <span role="img" aria-label="eye">👁️</span>
                </div>
                <p><strong>Label:</strong> {node.label}</p>
                <p><strong>Variable Name:</strong> {node.variableName}</p>
              </div>
            ))}

            {fileData.eventNodes.map((node) => (
              <div className="node-box input" key={node.id}>
                <div className="node-header">
                  <span className="node-icon">O</span>
                  <span className="node-title">Input Stream</span>
                </div>
                <p><strong>Label:</strong> {node.label}</p>
                <p><strong>Variable Name:</strong> {node.variableName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetPanel;
