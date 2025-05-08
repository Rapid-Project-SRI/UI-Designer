import { Node, Edge } from '@xyflow/react';

// Define a type for the node data
export interface NodeData {
    type: string;
    label?: string;
    [key: string]: any;
}

// Define a type for the custom node
export interface CustomNode extends Node<NodeData> {
    type: string;
    position: { x: number; y: number };
    data: NodeData;
}

// Define a type for the Content component's props
export interface ContentProps { }

// Define a type for the Content component's state
export interface ContentState {
    nodes: CustomNode[];
    edges: Edge[];
} 