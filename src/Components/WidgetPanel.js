import React, { useState } from 'react';
import './WidgetPanel.css';
import FileUploader from './FileUploader';

const WidgetPanel = ({ onClose, widgetName, fileData, onFileLoad, onNodeSelect, selectedNode }) => {
  const [currentSelectedNode, setCurrentSelectedNode] = useState(selectedNode); // Initialize with the passed selectedNode

  const handleNodeClick = (node) => {
    setCurrentSelectedNode(node.id); // Update the local selected node state
    if (onNodeSelect) {
      onNodeSelect(node); // Notify the parent component about the selected node
    }
  };

  return (
    <div className="widget-panel-sidebar">
      <div className="sidebar-header">
        <h3>Connect stream</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="sidebar-content">
        {!fileData ? (
          <FileUploader onFileLoad={onFileLoad} />
        ) : (
          <div>
            <div className="file-name-bar">
              <span>{fileData.fileName}</span>
              <button className="clear-button" onClick={() => setCurrentSelectedNode(null)}>✕</button>
            </div>

            {fileData.outputNodes.map((node) => (
              <div
                className={`node-box output ${currentSelectedNode === node.id ? 'selected' : ''}`}
                key={node.id}
                onClick={() => handleNodeClick(node)}
              >
                <div className="node-header">
                  <span className="node-icon">O</span>
                  <span className="node-title">Output Stream</span>
                </div>
                <p><strong>Label:</strong> {node.label}</p>
                <p><strong>Variable Name:</strong> {node.variableName}</p>
              </div>
            ))}

            {fileData.eventNodes.map((node) => (
              <div
                className={`node-box input ${currentSelectedNode === node.id ? 'selected' : ''}`}
                key={node.id}
                onClick={() => handleNodeClick(node)}
              >
                <div className="node-header">
                  <span className="node-icon">I</span>
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
