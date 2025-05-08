import { XYPosition } from "@xyflow/react";

export type CombineMode = 'merge' | 'zip' | 'combineLatest';

export type NodeType =
    'variableNode' | 'transformerNode' | 'dataProducerNode' |
    'combinerNode' | 'eventNode' | 'outputNode' | 'branchNode';

export interface Node {
    id: string;
    type: NodeType;
    label: string;
    position: XYPosition;
    variableName?: string;
    selected?: boolean;
    expression?: string;
    pattern?: PatternItem<number>[];
    startTick?: number;
    endTick?: number;
    mode?: CombineMode;
}

export interface Edge {
    source: string;
    target: string;
}

export interface PatternItem<T> {
    data: T;
    delayTicks: number; // Delay in ticks.
}