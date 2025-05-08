// src/components/Canvas.jsx
import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import './Canvas.css';

export default function Canvas({  
  children,               // typically your <WidgetItem/>s  
  onBoundaryChange,       // (rect) => void  — fires when user finalizes or moves/resizes  
  initialBoundary = null  // { x,y,width,height } to rehydrate on import  
}) {
  // Boundary state lives here once drawn:
  const [boundary, setBoundary] = useState(initialBoundary);
  // Drawing‐in‐progress state:
  const [drawing, setDrawing] = useState(false);
  const [startPt, setStartPt]   = useState({ x: 0, y: 0 });
  const [draftRect, setDraftRect] = useState(null);

  const overlayRef = useRef();

  // 1) Start rubber‐band draw
  function handleMouseDown(e) {
    if (boundary) return;           // only allow one boundary
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    setStartPt({ x, y });
    setDraftRect({ x, y, width: 0, height: 0 });
    setDrawing(true);
  }

  // 2) Update rubber‐band
  function handleMouseMove(e) {
    if (!drawing) return;
    const { offsetX: mx, offsetY: my } = e.nativeEvent;
    const x = Math.min(startPt.x, mx);
    const y = Math.min(startPt.y, my);
    const width  = Math.abs(mx - startPt.x);
    const height = Math.abs(my - startPt.y);
    setDraftRect({ x, y, width, height });
  }

  // 3) Finish draw
  function handleMouseUp() {
    if (!drawing) return;
    setDrawing(false);
    if (draftRect.width < 5 || draftRect.height < 5) {
      setDraftRect(null);
      return; // too small—cancel
    }
    setBoundary(draftRect);
    onBoundaryChange?.(draftRect);
    setDraftRect(null);
  }

  // 4) If not yet drawn, show the full‐screen overlay to capture draw events
  if (!boundary) {
    return (
      <div
        ref={overlayRef}
        className="canvas-overlay"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {draftRect && (
          <div
            className="canvas-draft"
            style={{
              left:   draftRect.x,
              top:    draftRect.y,
              width:  draftRect.width,
              height: draftRect.height
            }}
          />
        )}
      </div>
    );
  }

  // 5) Once drawn, switch to resizable/draggable Rnd
  return (
    <Rnd
      className="canvas-frame"
      size={{ width: boundary.width, height: boundary.height }}
      position={{ x: boundary.x, y: boundary.y }}
      bounds="parent"
      onDragStop={(_, d) => {
        const updated = { ...boundary, x: d.x, y: d.y };
        setBoundary(updated);
        onBoundaryChange?.(updated);
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        const updated = {
          x: pos.x,
          y: pos.y,
          width:  ref.offsetWidth,
          height: ref.offsetHeight
        };
        setBoundary(updated);
        onBoundaryChange?.(updated);
      }}
      enableResizing={{
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
      }}
      dragHandleClassName="canvas-frame-handle"
    >
      {children}
    </Rnd>
  );
}
