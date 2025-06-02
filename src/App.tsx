import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import './Globals.css';
import StreamSelector from './Components/StreamSelector';
import Canvas from './Components/Canvas';
import WidgetPalette from './Components/WidgetPalette';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    document.title = 'UI Designer';
  }, []);
  
  return (
    <div className='h-screen flex flex-col'>
      <div className='bg-white p-2 '>
        <h1 className="p-2 m-1 bg-primary text-text rounded-app">UI Design Framework</h1>
      </div>
      <ReactFlowProvider >
        <PanelGroup direction="horizontal" className="bg-white p-2 h-full w-full">
          <Panel className="rounded-app mr-4 min-w-[250px]" defaultSize={15} minSize={15}>
            <WidgetPalette />
          </Panel>

          <PanelResizeHandle style={{ width: '4px', background: '#ccc', cursor: 'col-resize' }} />

          <Panel className="h-full oberflow-hidden min-w-[300px]" defaultSize={80} minSize={10}>
            <Canvas />
          </Panel>

          <PanelResizeHandle style={{ width: '4px', background: '#ccc', cursor: 'col-resize' }} />

          <Panel className="rounded-app ml-4 min-w-[300px]" defaultSize={30} minSize={10}>
            <StreamSelector onClose={() => { }} />
          </Panel>
        </PanelGroup>
      </ReactFlowProvider>
    </div>
  );
};

export default App;
