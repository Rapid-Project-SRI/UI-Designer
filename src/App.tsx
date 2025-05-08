import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import './App.css';
import StreamSelector from './Components/StreamSelector';
import Canvas from './Components/Canvas';
import WidgetPalette from './Components/WidgetPalette';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <PanelGroup direction="horizontal" style={{ height: '100vh', width: '100vw' }}>
        <Panel defaultSize={20} minSize={10}>
          <WidgetPalette />
        </Panel>

        <PanelResizeHandle style={{ width: '4px', background: '#ccc', cursor: 'col-resize' }} />

        <Panel defaultSize={80} minSize={10}>
          <Canvas />
        </Panel>

        <PanelResizeHandle style={{ width: '4px', background: '#ccc', cursor: 'col-resize' }} />

        <Panel defaultSize={20} minSize={10}>
          <StreamSelector onClose={() => {}} />
        </Panel>
      </PanelGroup>
    </ReactFlowProvider>
  );
};

export default App;
