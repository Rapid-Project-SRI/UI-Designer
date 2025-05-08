import React from 'react';

import { ReactFlowProvider } from 'react-flow-renderer';
import './App.css';
import PlaceHolder from './Components/PlaceHolder';
import Canvas from './Components/Canvas';
import WidgetPalette from './Components/WidgetPalette';
import { DndProvider } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
function App() {
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
      </PanelGroup>
    </ReactFlowProvider>
  );
}

export default App;
