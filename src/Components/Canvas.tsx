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
import PropertiesPopup from './PropertiesPopup';
import { simulationStore } from '../storage/SimulationStore';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { buildNodeAdjacencyList, buildWidgetAdjacencyList } from '../utils/AdjacencyListUtils';
import InfoIcon from './InfoIcon';
import { generateVisualizerEdges, getSelectedStreamsSignature, rebuildReactFlowState } from '../utils/CanvasUtils';

/*
 * Canvas component for the UI Designer workspace.
 * Handles rendering, drag-and-drop, keyboard shortcuts, and visualizer mode.
 *
 * @returns {JSX.Element} The rendered Canvas component.
 */
const Canvas = observer(() => {
    // React Flow state for nodes and edges
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    const { project } = useReactFlow();
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState(false);
    const [showPropertiesPopup, setShowPropertiesPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | null>(null);
    const [visualizerMode, setVisualizerMode] = useState(false);

    /*
     * Effect: Rebuilds React Flow state when widgets change.
     * @return {void}
     */
    useEffect(() => {
        rebuildReactFlowState(setNodes, setEdges);
    }, [setNodes, setEdges, designStore.widgets.length]);

    /*
     * Effect: Handles focus/blur events for keyboard shortcuts.
     * @return {void}
     */
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

    /*
     * Handles keyboard shortcuts for copy, paste, delete, and undo/redo.
     * @param {React.KeyboardEvent<HTMLDivElement>} e - The keyboard event.
     * @return {void}
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!hasFocus) return;

        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            // TODO: Implement copy logic for widgets
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            // TODO: Implement paste logic for widgets
            rebuildReactFlowState(setNodes, setEdges);
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            // Delete selected widgets
            designStore.deleteSelectedWidgets();
            rebuildReactFlowState(setNodes, setEdges);
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            // TODO: Implement undo/redo logic if needed
            rebuildReactFlowState(setNodes, setEdges);
        }
    };

    /*
     * Triggers file input for uploading JSON.
     * @return {void}
     */
    const uploadJson = () => {
        fileInputRef.current?.click();
    };

    /*
     * Handles JSON file upload and hydrates the design store.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
     * @return {void}
     */
    const onJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                // Hydrate widgets from JSON
                console.log("loading new JSON")
                designStore.hydrate(json);
                designStore.widgets.forEach(widget => widget.selectedStreams = undefined);
                rebuildReactFlowState(setNodes, setEdges);
            } catch (err) {
                console.error("Failed to load JSON:", err);
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    /*
     * Downloads the current widgets as a JSON file.
     * @return {void}
     */
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

    /*
     * Downloads a combined RAPID Simulation JSON file.
     * @return {void}
     */
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

    /*
     * Handles drag over event for widget drop.
     * @param {React.DragEvent} e - The drag event.
     * @return {void}
     */
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    /*
     * Handles drop event to add a new widget to the canvas.
     * @param {React.DragEvent} e - The drop event.
     * @return {void}
     */
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const widgetType = e.dataTransfer.getData('application/reactflow');
        if (!widgetType) return;

        const bounds = (e.target as HTMLDivElement).getBoundingClientRect();
        const position = project({
            x: e.clientX - bounds.left - 50,
            y: e.clientY - bounds.top - 20,
        });

        addWidget(widgetType as any, position);
        designStore.saveHistory();
    };

    /*
     * Handles node drag stop event to update widget position.
     * @param {React.MouseEvent} e - The mouse event.
     * @param {Node} node - The node being dragged.
     * @return {void}
     */
    const onNodeDragStop = (e: React.MouseEvent, node: Node) => {
        designStore.updateWidgetPosition(node.id, node.position)
        designStore.saveHistory();
    }

    /*
     * Adds a new widget to the design store.
     * @param {WidgetType} type - The type of widget to add.
     * @param {{ x: number, y: number }} position - The position for the new widget.
     * @return {void}
     */
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

    /*
     * Handles right-click context menu on a node to show properties popup.
     * @param {React.MouseEvent} event - The mouse event.
     * @param {Node} node - The node being right-clicked.
     * @return {void}
     */
    const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        designStore.setSelectedWidgets([node.id]);
        setShowPropertiesPopup(true);
        setPopupPosition({ x: event.clientX, y: event.clientY });
    };

    /*
     * Handles click on the canvas to clear selection and hide popup.
     * @return {void}
     */
    const handleCanvasClick = () => {
        canvasRef.current?.focus();
        designStore.setSelectedWidgets([]);
        setShowPropertiesPopup(false);
    };

    /*
     * Handles start of canvas interaction to hide properties popup.
     * @return {void}
     */
    const handleCanvasInteractionStart = () => {
        setShowPropertiesPopup(false);
    };

    /*
     * Effect: Handles visualizer mode toggle and edge generation.
     * @return {void}
     */
    const selectedStreamsSignature = getSelectedStreamsSignature();
    useEffect(() => {
        if (visualizerMode) {
            // Build adjacency lists and edges using shared utility functions
            const nodeAdj = buildNodeAdjacencyList();
            const widgetAdj = buildWidgetAdjacencyList(nodeAdj);
            const vizEdges = generateVisualizerEdges(widgetAdj);
            setEdges(vizEdges);
        } else {
            // Normal mode: no visualizer edges
            rebuildReactFlowState(setNodes, setEdges);
        }
        // Add selectedStreamsSignature to dependencies
    }, [visualizerMode, setNodes, setEdges, designStore.widgets.length, selectedStreamsSignature, simulationStore.nodes.length, simulationStore.edges.length]);

    return (
        <div
            ref={canvasRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className='flex flex-col h-full'
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
                        <InfoIcon/>
                    </div>
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
