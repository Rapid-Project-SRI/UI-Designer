import React, { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    NodeChange,
    EdgeChange,
    Node,
} from '@xyflow/react';
import { Box } from '@mui/material';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from '../nodes/CustomNodes';
import './Content.css';
import { ContentProps, CustomNode, NodeData } from '../types';

const Content: React.FC<ContentProps> = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            event.stopPropagation();

            const template = JSON.parse(
                event.dataTransfer.getData('application/reactflow')
            );

            // Get the position where the node was dropped
            const position = {
                x: event.clientX - event.currentTarget.getBoundingClientRect().left,
                y: event.clientY - event.currentTarget.getBoundingClientRect().top,
            };

            // Create a new node with a unique ID
            const newNode: Node<NodeData> = {
                id: `${template.type}-${Date.now()}`,
                type: 'custom',
                position,
                data: { ...template.data },
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [setNodes]
    );

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: '#f8f9fa'
            }}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </Box>
    );
};

export default Content; 