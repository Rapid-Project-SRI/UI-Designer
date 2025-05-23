import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ReactFlow, {
    MiniMap,
    Background,
    useNodesState,
    useEdgesState,
    Connection,
    Node,
    Edge,
    useReactFlow
} from 'react-flow-renderer';
import { designStore, WidgetType } from '../storage/DesignStore';
import { simulationStore } from '../storage/SimulationStore';
import { widgetTypes } from '../types/WidgetTypes';
import '../styles/Canvas.css';
import PropertiesPopup from './PropertiesPopup';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InfoIcon from './InfoIcon';

const Canvas = observer(() => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    const { project } = useReactFlow();
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState(false);
    const [showPropertiesPopup, setShowPropertiesPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | null>(null);
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
        // Assuming widgets don't have edges, but if they do, handle them similarly
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
            // Implement copy logic for widgets
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            // Implement paste logic for widgets
            rebuildReactFlowState();
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            // Implement delete logic for selected widgets
            designStore.deleteSelectedWidgets();
            rebuildReactFlowState();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            // Implement undo/redo logic if needed
            rebuildReactFlowState();
        }
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
                // Implement hydrate logic for widgets
                console.log("loading new JSON")
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
        e.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const widgetType = e.dataTransfer.getData('application/reactflow');
        if (!widgetType) return;

        // Use React Flow's project() directly for perfect alignment
        const position = project({
            x: e.clientX,
            y: e.clientY,
        });

        addWidget(widgetType as any, position);
        designStore.saveHistory();
    };

    const onNodeDragStop = (e: React.MouseEvent, node: Node) => {
        designStore.updateWidgetPosition(node.id, node.position)
        designStore.saveHistory();
    }

    const addWidget = (type: WidgetType, position: { x: number, y: number }) => {
        const id = designStore.generateWidgetId();
        const label = `${type}_${id}`;
        let widget: any = { id, type, label, position, style: { color: '', font: '' } };
        if (type === 'StaticImage') {
            // StaticImage does not use color, but supports other customizations
            widget.style = { font: '', width: 120, height: 120, borderRadius: 8 };
            widget.imageUrl = undefined; // Placeholder for uploaded image
        }
        designStore.addWidget(widget);
    };

    const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        designStore.setSelectedWidgets([node.id]);
        setShowPropertiesPopup(true);
        setPopupPosition({ x: event.clientX, y: event.clientY });
    };

    const handleCanvasClick = () => {
        canvasRef.current?.focus();
        designStore.setSelectedWidgets([]);
        setShowPropertiesPopup(false);
    };

    const handleCanvasInteractionStart = () => {
        setShowPropertiesPopup(false);
    };

    // 1. Build Node Adjacency List
    function buildNodeAdjacencyList() {
        // outputNodeId -> [eventNodeId, ...]
        const adjacency: Record<string, string[]> = {};
        const nodes = simulationStore.nodes;
        const edges = simulationStore.edges;

        // Find all output nodes
        const outputNodes = nodes.filter(n => n.type === 'outputNode');
        const eventNodes = nodes.filter(n => n.type === 'eventNode');

        // For each output node, find all event nodes that can reach it
        for (const output of outputNodes) {
            // Traverse backwards from output to find event nodes
            const visited = new Set<string>();
            const stack = [output.id];
            const relatedEvents: string[] = [];
            while (stack.length) {
                const current = stack.pop()!;
                if (visited.has(current)) continue;
                visited.add(current);
                const incoming = edges.filter(e => e.target === current).map(e => e.source);
                for (const src of incoming) {
                    const srcNode = nodes.find(n => n.id === src);
                    if (srcNode?.type === 'eventNode') {
                        relatedEvents.push(srcNode.id);
                    } else {
                        stack.push(src);
                    }
                }
            }
            adjacency[output.id] = relatedEvents;
        }
        return adjacency;
    }

    // 2. Build Widget Adjacency List
    function buildWidgetAdjacencyList(nodeAdjacency: Record<string, string[]>) {
        // widgetId -> [adjacentWidgetId, ...]
        const widgetAdj: Record<string, string[]> = {};
        const widgets = designStore.widgets;

        // Map nodeId to widgets that reference it
        const nodeIdToWidgets: Record<string, string[]> = {};
        for (const widget of widgets) {
            if (widget.selectedStreams) {
                for (const nodeId of widget.selectedStreams) {
                    if (!nodeIdToWidgets[nodeId]) nodeIdToWidgets[nodeId] = [];
                    nodeIdToWidgets[nodeId].push(widget.id);
                }
            }
        }

        // For each widget, find its output nodes in selectedStreams
        for (const widget of widgets) {
            widgetAdj[widget.id] = [];
            if (!widget.selectedStreams) continue;
            for (const nodeId of widget.selectedStreams) {
                // If this node is an output node, get its related event nodes
                if (nodeAdjacency[nodeId]) {
                    // For each related event node, find widgets that reference it
                    for (const eventNodeId of nodeAdjacency[nodeId]) {
                        const eventWidgets = nodeIdToWidgets[eventNodeId] || [];
                        for (const eventWidgetId of eventWidgets) {
                            if (!widgetAdj[widget.id].includes(eventWidgetId)) {
                                widgetAdj[widget.id].push(eventWidgetId);
                            }
                        }
                    }
                }
            }
        }
        return widgetAdj;
    }

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
            .map(w => `${w.id}:${(w.selectedStreams||[]).join(',')}`)
            .sort()
            .join('|');
    }

    // 4. Toggle and Effect
    useEffect(() => {
        if (visualizerMode) {
            // Build adjacency lists and edges
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
            style={{ width: '100%', height: '100vh', outline: 'none' }}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <div style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={visualizerMode}
                            onChange={() => setVisualizerMode(v => !v)}
                            color="primary"
                        />
                    }
                    label={visualizerMode ? 'Connection Visualizer' : 'Layout Editor'}
                />
                <button onClick={downloadJson}>Download JSON</button>
                <button onClick={uploadJson} style={{ marginLeft: 8 }}>Upload JSON</button>
                <button onClick={downloadRAPIDSimJson} style={{ marginLeft: 8 }}>Download RAPID Simulation</button>
                <InfoIcon />
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={onJsonFileChange}
                    style={{ display: 'none' }}
                />
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={(changes) => {
                    onNodesChange(changes);
                    handleCanvasInteractionStart();
                }}
                onEdgesChange={(changes) => {
                    onEdgesChange(changes);
                    handleCanvasInteractionStart();
                }}
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
            >
                <MiniMap />
                <Background />
            </ReactFlow>

            {showPropertiesPopup && popupPosition && (
                <div style={{ position: 'absolute', top: popupPosition.y, left: popupPosition.x }}>
                    <PropertiesPopup title="Widget" />
                </div>
            )}
        </div>
    );
});

export default Canvas;
