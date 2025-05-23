import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ReactFlow, {
    MiniMap,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
    Node,
    Edge
} from 'react-flow-renderer';
import { designStore, WidgetType } from '../storage/DesignStore';
import { widgetTypes } from '../types/WidgetTypes';
import '../styles/Canvas.css';
import { IoMdDownload } from "react-icons/io";
import PropertiesPopup from './PropertiesPopup';
import { simulationStore } from '../storage/SimulationStore';
import BorderOverlay from './BorderOverlay';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IoInformationCircleOutline } from "react-icons/io5";
import { buildNodeAdjacencyList, buildWidgetAdjacencyList } from '../utils/AdjacencyListUtils';

const Canvas = observer(() => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    const { project } = useReactFlow();
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState(false);
    const [showPropertiesPopup, setShowPropertiesPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | null>(null);
    const [drawingRectangle, setDrawingRectangle] = useState(false);
    const [isDropInvalid, setIsDropInvalid] = useState(false);
    const [visualizerMode, setVisualizerMode] = useState(false);

    const rebuildReactFlowState = () => {
        setNodes(
            designStore.widgets.map((widget) => ({
                id: widget.id,
                type: widget.type,
                data: { widgetId: widget.id },
                position: widget.position,
            } as Node))
        );
        setEdges([]);
    };

    useEffect(() => {
        rebuildReactFlowState();
    }, [designStore.widgets.length]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleFocus = () => setHasFocus(true);
        const handleBlur = () => setHasFocus(false);

        canvas.addEventListener('focus', handleFocus);
        canvas.addEventListener('blur', handleBlur);

        return () => {
            canvas.removeEventListener('focus', handleFocus);
            canvas.removeEventListener('blur', handleBlur);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!hasFocus) return;

        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            rebuildReactFlowState();
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            designStore.deleteSelectedWidgets();
            rebuildReactFlowState();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            rebuildReactFlowState();
        }
    };

    const isWithinBounds = (position: { x: number; y: number }) => {
        const bounds = designStore.placementBounds;
        if (!bounds) return true;
        return (
            position.x >= bounds.x &&
            position.x <= bounds.x + bounds.width &&
            position.y >= bounds.y &&
            position.y <= bounds.y + bounds.height
        );
    };

    const uploadJson = () => {
        fileInputRef.current?.click();
    };

    const onJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                designStore.hydrate(json);
                designStore.widgets.forEach(widget => widget.selectedStreams = undefined);
                rebuildReactFlowState();
            } catch (err) {
                console.error("Failed to load JSON:", err);
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    const downloadJson = () => {
        const json = designStore.serialize();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'widgets.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadRAPIDSimJson = () => {
        const designJson = JSON.parse(designStore.serialize());
        const simJson = JSON.parse(simulationStore.serialize());
        const combinedJson = {
            widgets: designJson.widgets,
            nodes: simJson.nodes,
            edges: simJson.edges
        };
        const blob = new Blob([JSON.stringify(combinedJson)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapid_simulation.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();

        const bounds = (e.target as HTMLDivElement).getBoundingClientRect();
        const position = project({
            x: e.clientX - bounds.left - 50,
            y: e.clientY - bounds.top - 20,
        });

        if (!isWithinBounds(position)) {
            setIsDropInvalid(true);
            e.dataTransfer.dropEffect = 'none';
        } else {
            setIsDropInvalid(false);
            e.dataTransfer.dropEffect = 'move';
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDropInvalid(false);

        const widgetType = e.dataTransfer.getData('application/reactflow');
        if (!widgetType) return;

        // Use React Flow's project() directly for perfect alignment
        const position = project({
            x: e.clientX,
            y: e.clientY,
        });

        if (!isWithinBounds(position)) {
            return;
        }

        addWidget(widgetType as any, position);
        designStore.saveHistory();
    };

    const onNodeDragStop = (e: React.MouseEvent, node: Node) => {
        if (!isWithinBounds(node.position)) {
            setIsDropInvalid(true);
            return;
        }
        setIsDropInvalid(false);
        designStore.updateWidgetPosition(node.id, node.position);
        designStore.saveHistory();
    };


    const addWidget = (type: WidgetType, position: { x: number, y: number }) => {
        const id = designStore.generateWidgetId();
        const label = `${type}_${id}`;
        let widget: any = { id, type, label, position, style: { color: '', font: '' } };
        if (type === 'StaticImage') {
            widget.style = { font: '', width: 120, height: 120, borderRadius: 8 };
            widget.imageUrl = undefined;
        }
        designStore.addWidget(widget);
    };

    const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        designStore.setSelectedWidgets([node.id]);

        if (!canvasRef.current) return;
        const canvasBounds = canvasRef.current.getBoundingClientRect();

        // Position relativ zum Canvas
        const x = event.clientX - canvasBounds.left;
        const y = event.clientY - canvasBounds.top;

        setPopupPosition({ x, y });
        setShowPropertiesPopup(true);
        setPopupPosition({ x: event.clientX, y: event.clientY });
        console.log("Node context menu", node.id);
    };


    const handleCanvasClick = () => {
        canvasRef.current?.focus();
        designStore.setSelectedWidgets([]);
        setShowPropertiesPopup(false);
    };

    const handleCanvasInteractionStart = () => {
        setShowPropertiesPopup(false);
    };

    // 3. Generate Visualizer Edges
    function generateVisualizerEdges(widgetAdj: Record<string, string[]>) {
        const edges: Edge[] = [];
        for (const [sourceId, targets] of Object.entries(widgetAdj)) {
            for (const targetId of targets) {
                edges.push({
                    id: `viz-${targetId}-${sourceId}`,
                    source: targetId,
                    target: sourceId,
                    type: 'default',
                    animated: true,
                    style: { stroke: '#FF00FF', strokeWidth: 2 }
                });
            }
        }
        return edges;
    }

    // Helper: Signature for all widgets' selectedStreams (for effect deps)
    function getSelectedStreamsSignature() {
        return designStore.widgets
            .map(w => `${w.id}:${(w.selectedStreams || []).join(',')}`)
            .sort()
            .join('|');
    }

    // 4. Toggle and Effect
    useEffect(() => {
        if (visualizerMode) {
            // Build adjacency lists and edges using shared utility functions
            const nodeAdj = buildNodeAdjacencyList();
            const widgetAdj = buildWidgetAdjacencyList(nodeAdj);
            const vizEdges = generateVisualizerEdges(widgetAdj);
            setEdges(vizEdges);
        } else {
            // Normal mode: no visualizer edges
            rebuildReactFlowState();
        }
        // Add selectedStreamsSignature to dependencies
    }, [visualizerMode, designStore.widgets.length, getSelectedStreamsSignature(), simulationStore.nodes.length, simulationStore.edges.length]);

    return (
        <div
            ref={canvasRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className='flex flex-col h-full'
            style={{
                cursor: isDropInvalid ? 'not-allowed' : (drawingRectangle ? 'crosshair' : 'default'),
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <div className="flex flex-grow flex-col border-2 border-primary border-dashed rounded-app mx-2 p-2 bg-primary">
                <div className='flex justify-between items-center'>
                    <h1 className='mb-2'>Workspace</h1>
                    <div className='flex items-center gap-2'>
                        <FormControlLabel
                            label={visualizerMode ? 'Connection Visualizer' : 'Layout Editor'}
                            control={
                                <Switch
                                    checked={visualizerMode}
                                    onChange={() => setVisualizerMode(v => !v)}
                                    color="primary"
                                />
                            }
                        />
                        <IoInformationCircleOutline size={25} color='var(--color-primary)' />
                    </div>
                </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={widgetTypes}
                    onSelectionChange={({ nodes }) => {
                        designStore.setSelectedWidgets(nodes.map(n => n.id));
                    }}
                    onNodeContextMenu={handleNodeContextMenu}
                    onPaneClick={handleCanvasClick}
                    onPaneScroll={handleCanvasInteractionStart}
                    onPaneContextMenu={handleCanvasInteractionStart}
                    onMove={handleCanvasInteractionStart}
                    onNodeDragStop={onNodeDragStop}
                    fitView
                    panOnScroll={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                    panOnDrag={false}
                >
                    <MiniMap />
                    <Background />
                </ReactFlow>
                <BorderOverlay />
                {designStore.placementBounds && (
                    <div
                        style={{
                            position: 'absolute',
                            left: designStore.placementBounds.x,
                            top: designStore.placementBounds.y,
                            width: designStore.placementBounds.width,
                            height: designStore.placementBounds.height,
                            border: '2px dashed red',
                            pointerEvents: 'none',
                            zIndex: 5
                        }}
                    />
                )}
            </div>

            {showPropertiesPopup && popupPosition && (
                <div style={{ position: 'absolute', top: popupPosition.y, left: popupPosition.x }}>
                    <PropertiesPopup title="Widget" />
                </div>
            )}

            <div className="my-5 p-2 flex gap-2 justify-between">
                <button onClick={uploadJson} className="flex btn-primary">Upload JSON </button>
                <button onClick={downloadJson} className="btn-navy flex gap-3">Download JSON file</button>
                <button onClick={downloadRAPIDSimJson} className="btn-navy flex gap-3">Download RAPID Simulation</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={onJsonFileChange}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
});

export default Canvas;
