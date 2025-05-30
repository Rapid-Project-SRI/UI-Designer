import { XYPosition } from "@xyflow/react";

export type CombineMode = 'merge' | 'zip' | 'combineLatest';

export type NodeType =
    'variableNode' | 'transformerNode' | 'dataProducerNode' |
    'combinerNode' | 'eventNode' | 'outputNode';

export enum DataType {
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean',
    OBJECT = 'object'
}

export interface Node {
    id: string;
    type: NodeType;
    label: string;
    position: XYPosition
    dataType: DataType;
    description: string;
    variableName?: string;
    selected?: boolean; // for selection

    //only for CalcNode
    expression?: string;

    //only for DataProd
    pattern?: PatternItem<number>[]; // the pattern is stored as an array of objects
    startTick?: number;
    endTick?: number;
    repeat?: boolean; // whether to repeat the pattern
    defaultVal?: any;

    //only for VariableNode
    initialValue?: any; // initial value for variable nodes

    //only for Combiner
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