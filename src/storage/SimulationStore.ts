import { makeAutoObservable } from 'mobx';
import { Node, Edge } from '../types/SimulationTypes';

export class SimulationStore {
    nodes: Node[] = [];
    edges: Edge[] = [];
    fileName: string = '';
    
    constructor() {
        makeAutoObservable(this);
    }

    loadSimulation(json: string, fileName: string) {
        const data = JSON.parse(json);
        console.log(data);
        this.nodes = data.nodes || [];
        this.edges = data.edges || [];
        console.log([...this.nodes]);
        console.log(data.nodes);
        console.log([...this.edges]);
        console.log(data.edges);
        this.fileName = fileName || '';
    }

    get displayStreams() {
        return this.nodes.filter(node => node.type === 'outputNode');
    }

    get interactionStreams() {
        return this.nodes.filter(node => node.type === 'eventNode');
    }

    serialize() {
        return JSON.stringify({ nodes: this.nodes, edges: this.edges });
    }
}

export const simulationStore = new SimulationStore();
