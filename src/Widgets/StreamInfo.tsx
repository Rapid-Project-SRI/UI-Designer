import React, { useState } from 'react';
import { designStore } from '../storage/DesignStore';
import { simulationStore } from '../storage/SimulationStore';

const StreamInfoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="2" width="24" height="24" rx="5" fill="#90b4c6" />
    <circle cx="8" cy="20" r="3" fill="white" />
    <line x1="10" y1="18" x2="20" y2="8" stroke="white" strokeWidth="2.2" />
    <line x1="20" y1="8" x2="16.5" y2="9.5" stroke="white" strokeWidth="2.2" />
    <line x1="20" y1="8" x2="18.5" y2="11.5" stroke="white" strokeWidth="2.2" />
  </svg>
);

const StreamInfo: React.FC<{ widgetId: string }> = ({ widgetId }) => {
  const [showInfo, setShowInfo] = useState(false);
  const widget = designStore.widgets.find(w => w.id === widgetId);
  const streams = widget?.selectedStreams || [];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 1,
        right: 1,
        cursor: 'pointer',
        zIndex: 2,
      }}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <StreamInfoIcon />
      {showInfo && (
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 0,
            background: 'white',
            border: '1px solid #1976d2',
            borderRadius: 4,
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
            zIndex: 3,
            minWidth: 180,
            color: '#222'
          }}
        >
          <strong>Connected Streams:</strong><br />
          {streams.length > 0 ? (
            streams.map(streamId => {
              const stream = simulationStore.nodes.find(n => n.id === streamId);
              return stream ? (
                <div key={streamId}>
                  <span>Label: {stream.label}</span><br />
                  <span>Variable: {stream.variableName}</span><br />
                </div>
              ) : null;
            })
          ) : (
            <span>No streams connected</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamInfo;