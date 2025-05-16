import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { designStore } from '../storage/DesignStore';
import { simulationStore } from '../storage/SimulationStore';
import FileUploader from './FileUploader';
import '../styles/StreamSelector.css';

interface StreamSelectorProps {
  onClose: () => void;
}

const StreamSelector: React.FC<StreamSelectorProps> = observer(({ onClose }) => {
  const [currentSelectedNode, setCurrentSelectedNode] = useState<string[]>([]);

  useEffect(() => {
    if (designStore.selectedWidgetIds.length > 0) {
      const selectedWidget = designStore.widgets.find(w => w.id === designStore.selectedWidgetIds[0]);
      if (selectedWidget) {
        setCurrentSelectedNode(selectedWidget.selectedStreams || []);
      }
    }
  }, [designStore.selectedWidgetIds]);

  const handleNodeClick = (node: any) => {
    if (designStore.selectedWidgetIds.length > 0) {
      const selectedWidgetId = designStore.selectedWidgetIds[0];
      designStore.updateWidgetStream(selectedWidgetId, node.id);
      const selectedWidget = designStore.widgets.find(w => w.id === selectedWidgetId);
      if (selectedWidget) {
        setCurrentSelectedNode(selectedWidget.selectedStreams || []);
      }
    }
  };

  const selectedWidget = designStore.widgets.find(w => w.id === designStore.selectedWidgetIds[0]);

  const displayStreams = simulationStore.displayStreams;
  const interactionStreams = simulationStore.interactionStreams;

  return (
    <div className="widget-panel-sidebar">
      <div className="sidebar-header">
        <h3>Connect stream</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="sidebar-content">
        {selectedWidget && <h4>Selected Widget: {selectedWidget.label}</h4>}
        {!simulationStore.fileName ? (
          <FileUploader />
        ) : (
          <div>
            <div className="file-name-bar">
              <span>{simulationStore.fileName}</span>
              <button className="clear-button" onClick={() => setCurrentSelectedNode([])}>✕</button>
            </div>

            {displayStreams.map((node: any) => (
              <div
                className={`node-box output ${currentSelectedNode.includes(node.id) ? 'selected' : ''}`}
                key={node.id}
                onClick={() => handleNodeClick(node)}
              >
                <div className="node-header">
                  <span className="node-icon">D</span>
                  <span className="node-title">Display Stream</span>
                </div>
                <p><strong>Label:</strong> {node.label}</p>
                <p><strong>Variable Name:</strong> {node.variableName}</p>
              </div>
            ))}

            {interactionStreams.map((node: any) => (
              <div
                className={`node-box input ${currentSelectedNode.includes(node.id) ? 'selected' : ''}`}
                key={node.id}
                onClick={() => handleNodeClick(node)}
              >
                <div className="node-header">
                  <span className="node-icon">I</span>
                  <span className="node-title">Interaction Stream</span>
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
});

export default StreamSelector;
