import React, { useState, useRef } from 'react';
import '../styles/BorderOverlay.css';
import { designStore } from '../storage/DesignStore';

const BorderOverlay = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [hasDrawn, setHasDrawn] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (hasDrawn) return;

        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setStartPos({ x, y });
        setCurrentPos({ x, y });
        setIsDrawing(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !startPos) return;

        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentPos({ x, y });
    };

    const handleMouseUp = () => {
        if (!isDrawing || !startPos || !currentPos) return;

        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);

        designStore.setPlacementBounds({ x, y, width, height });

        setIsDrawing(false);
        setHasDrawn(true);
        setStartPos(null);
        setCurrentPos(null);
    };

    const getStyle = () => {
        const bounds = isDrawing && startPos && currentPos
            ? {
                x: Math.min(startPos.x, currentPos.x),
                y: Math.min(startPos.y, currentPos.y),
                width: Math.abs(currentPos.x - startPos.x),
                height: Math.abs(currentPos.y - startPos.y),
            }
            : designStore.getPlacementBounds();

        if (!bounds) return { display: 'none' };

        return {
            position: 'absolute' as const,
            left: bounds.x,
            top: bounds.y,
            width: bounds.width,
            height: bounds.height,
            border: '2px dashed red',
            backgroundColor: 'transparent',
            pointerEvents: 'none' as const,
            zIndex: 1,
        };
    };

    return (
        <div
            ref={overlayRef}
            className="border-overlay"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1000,
                pointerEvents: hasDrawn ? 'none' : 'auto',
                cursor: isDrawing ? 'crosshair' : 'default',
            }}
        >
            {(isDrawing || designStore.getPlacementBounds()) && (
                <div style={getStyle()} />
            )}
        </div>
    );
};

export default BorderOverlay;