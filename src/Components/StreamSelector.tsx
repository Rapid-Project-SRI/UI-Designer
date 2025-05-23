import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { designStore } from '../storage/DesignStore';
import { simulationStore } from '../storage/SimulationStore';
import FileUploader from './FileUploader';
import { getGroupedStreams } from '../utils/AdjacencyListUtils';
import '../styles/StreamSelector.css';

interface StreamSelectorProps {
  onClose: () => void;
}

const StreamSelector: React.FC<StreamSelectorProps> = observer(({ onClose }) => {
  const [currentSelectedNode, setCurrentSelectedNode] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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

  const toggleGroupExpansion = (outputNodeId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(outputNodeId)) {
      newExpanded.delete(outputNodeId);
    } else {
      newExpanded.add(outputNodeId);
    }
    setExpandedGroups(newExpanded);
  };

  const selectedWidget = designStore.widgets.find(w => w.id === designStore.selectedWidgetIds[0]);

  // Get grouped streams using the adjacency list
  const { groupedStreams, orphanedEventStreams } = getGroupedStreams();

  return (
    <div className="widget-panel-sidebar">
      <div className="sidebar-header">
        <h3>Connect stream</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="sidebar-content" style={{overflowY: 'auto'}}>
        {selectedWidget && <h4>Selected Widget: {selectedWidget.label}</h4>}
        {!simulationStore.fileName ? (
          <FileUploader />
        ) : (
          <div>
            <div className="file-name-bar">
              <span>{simulationStore.fileName}</span>
              <button className="clear-button" onClick={() => setCurrentSelectedNode([])}>✕</button>
            </div>

            {/* Grouped Streams Display */}
            {groupedStreams.map((group) => {
              const { outputStream, connectedEventStreams } = group;
              const isExpanded = expandedGroups.has(outputStream.id);
              const hasConnectedEvents = connectedEventStreams.length > 0;

              return (
                <div key={outputStream.id} className="stream-group">
                  {/* Output Stream - Primary Group */}
                  <div
                    className={`node-box output group-header ${currentSelectedNode.includes(outputStream.id) ? 'selected' : ''}`}
                    onClick={() => handleNodeClick(outputStream)}
                  >
                    <div className="node-header">
                      <span className="node-icon">D</span>
                      <span className="node-title">Display Stream</span>
                      {hasConnectedEvents && (
                        <button
                          className="expand-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroupExpansion(outputStream.id);
                          }}
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      )}
                    </div>
                    <p><strong>Label:</strong> {outputStream.label}</p>
                    <p><strong>Variable Name:</strong> {outputStream.variableName}</p>
                    {hasConnectedEvents && (
                      <p className="connection-info">
                        <strong>Connected Events:</strong> {connectedEventStreams.length}
                      </p>
                    )}
                  </div>

                  {/* Connected Event Streams - Subgroup */}
                  {hasConnectedEvents && isExpanded && (
                    <div className="subgroup">
                      {connectedEventStreams.map((eventStream) => (
                        <div
                          key={eventStream.id}
                          className={`node-box input subgroup-item ${currentSelectedNode.includes(eventStream.id) ? 'selected' : ''}`}
                          onClick={() => handleNodeClick(eventStream)}
                        >
                          <div className="node-header">
                            <span className="node-icon">I</span>
                            <span className="node-title">Interaction Stream</span>
                          </div>
                          <p><strong>Label:</strong> {eventStream.label}</p>
                          <p><strong>Variable Name:</strong> {eventStream.variableName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Orphaned Event Streams (not connected to any output) */}
            {orphanedEventStreams.length > 0 && (
              <div className="orphaned-streams">
                <h5 className="orphaned-header">Unconnected Interaction Streams</h5>
                {orphanedEventStreams.map((eventStream) => (
                  <div
                    key={eventStream.id}
                    className={`node-box input ${currentSelectedNode.includes(eventStream.id) ? 'selected' : ''}`}
                    onClick={() => handleNodeClick(eventStream)}
                  >
                    <div className="node-header">
                      <span className="node-icon">I</span>
                      <span className="node-title">Interaction Stream</span>
                    </div>
                    <p><strong>Label:</strong> {eventStream.label}</p>
                    <p><strong>Variable Name:</strong> {eventStream.variableName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default StreamSelector;
