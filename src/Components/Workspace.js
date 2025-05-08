// src/components/Workspace.jsx
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './Workspace.css';


export default function Workspace({ children }) {
    return (
        <TransformWrapper
            //   initialScale={1}
            //   minScale={0.5}
            //   maxScale={4}
            disablePadding={true}
            wheel={{ 
                    // step: 0.1, 
                    wheelDisabled: true,
                    activationKeys: ['Meta', 'Control']
                }}
            doubleClick={{ disabled: true }}
            pinch={{ step: 5 }}
            limitToBounds={true}
            panning={{
                wheelPanning: true,
                allowLeftClickPan: false
            }}
        >
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <div className="workspace-grid">
                    {children}
                </div>
            </TransformComponent>
        </TransformWrapper>
    );
}
