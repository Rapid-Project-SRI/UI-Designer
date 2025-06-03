import { makeAutoObservable } from 'mobx';
import { Node, Edge } from '../types/SimulationTypes';

/**
 * SimulationStore manages the state of simulation nodes and edges for the UI Designer.
 * Handles loading, serializing, and filtering simulation data.
 */
export class SimulationStore {
    nodes: Node[] = [];
    edges: Edge[] = [];
    fileName: string = '';

    /**
     * Initializes the SimulationStore and makes it observable with MobX.
     * @return {void}
     */
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Loads simulation data (nodes and edges) from a JSON string.
     * @param {string} json - The JSON string containing simulation data.
     * @param {string} fileName - The name of the file being loaded (optional).
     * @return {void}
     */
    loadSimulation(json: string, fileName: string) {
        const data = JSON.parse(json);
        // Assign nodes and edges from parsed data, or empty arrays if not present
        this.nodes = data.nodes || [];
        this.edges = data.edges || [];
        this.fileName = fileName || '';
    }

    /**
     * Returns all nodes of type 'outputNode' (used for display streams).
     * @return {Node[]} Array of output nodes.
     */
    get displayStreams() {
        return this.nodes.filter(node => node.type === 'outputNode');
    }

    /**
     * Returns all nodes of type 'eventNode' (used for interaction streams).
     * @return {Node[]} Array of event nodes.
     */
    get interactionStreams() {
        return this.nodes.filter(node => node.type === 'eventNode');
    }

    /**
     * Serializes the current simulation state to a JSON string.
     * @return {string} JSON string of nodes and edges.
     */
    serialize() {
        return JSON.stringify({ nodes: this.nodes, edges: this.edges });
    }
}

/**
 * Singleton instance of SimulationStore for use throughout the app.
 */
export const simulationStore = new SimulationStore();
