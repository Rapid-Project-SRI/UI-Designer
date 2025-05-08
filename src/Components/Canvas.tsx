import React, { useEffect, useCallback, useRef, useState } from 'react';
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
import { designStore, WidgetType } from '../DesignStore';
import { nodeTypes } from '../nodes/CustomNodes';
import { widgetTypes } from '../WidgetTypes';
import './Canvas.css';
const Canvas = observer(() => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    const { project } = useReactFlow();
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = useState(false);

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
                rebuildReactFlowState();
            } catch (err) {
                console.error("Failed to load JSON:", err);
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    const downloadJson = () => {
        const json = JSON.stringify(designStore.widgets);
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

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

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

    const addWidget = (type: WidgetType, position: { x: number, y: number }) => {
        const id = designStore.generateWidgetId();
        const label = `${type}_${id}`;
        designStore.addWidget({ id, type, label, position });
    };

    return (
        <div
            ref={canvasRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={() => canvasRef.current?.focus()}
            style={{ width: '100%', height: '100vh', outline: 'none' }}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <div style={{ padding: 10 }}>
                <button onClick={downloadJson}>Download JSON</button>
                <button onClick={uploadJson} style={{ marginLeft: 8 }}>Upload JSON</button>
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={widgetTypes}
                // Assuming widgets don't have connections, but if they do, handle them similarly
                fitView
                panOnScroll
            >
                <MiniMap />
                <Background />
            </ReactFlow>
        </div>
    );
});

export default Canvas;
