import { simulationStore } from '../storage/SimulationStore';
import { designStore } from '../storage/DesignStore';

/**
 * Builds a node adjacency list mapping output nodes to connected event nodes
 * Uses DFS to traverse backwards from each output node to find all reachable event nodes
 * 
 * @returns Record<string, string[]> - outputNodeId -> [eventNodeId1, eventNodeId2, ...]
 */
export function buildNodeAdjacencyList(): Record<string, string[]> {
    // outputNodeId -> [eventNodeId, ...]
    const adjacency: Record<string, string[]> = {};
    const nodes = simulationStore.nodes;
    const edges = simulationStore.edges;

    // Find all output nodes
    const outputNodes = nodes.filter(n => n.type === 'outputNode');
    const eventNodes = nodes.filter(n => n.type === 'eventNode');

    // For each output node, find all event nodes that can reach it
    for (const output of outputNodes) {
        // Traverse backwards from output to find event nodes using DFS
        const visited = new Set<string>();
        const stack = [output.id];
        const relatedEvents: string[] = [];
        
        while (stack.length) {
            const current = stack.pop()!;
            if (visited.has(current)) continue;
            visited.add(current);
            
            // Find all incoming edges to current node
            const incoming = edges.filter(e => e.target === current).map(e => e.source);
            
            for (const src of incoming) {
                const srcNode = nodes.find(n => n.id === src);
                if (srcNode?.type === 'eventNode') {
                    // Found an event node connected to this output
                    relatedEvents.push(srcNode.id);
                } else {
                    // Continue traversing backwards
                    stack.push(src);
                }
            }
        }
        adjacency[output.id] = relatedEvents;
    }
    
    return adjacency;
}

/**
 * Builds a widget adjacency list mapping widgets with output streams to widgets with connected event streams
 * 
 * @param nodeAdjacency - The node adjacency list from buildNodeAdjacencyList()
 * @returns Record<string, string[]> - widgetId -> [adjacentWidgetId, ...]
 */
export function buildWidgetAdjacencyList(nodeAdjacency: Record<string, string[]>): Record<string, string[]> {
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

/**
 * Groups streams for display in hierarchical format:
 * - Output streams as primary groups
 * - Event/interaction streams as subgroups under each output they connect to
 * 
 * @returns Array of grouped stream objects for UI display
 */
export function getGroupedStreams() {
    const nodeAdjacency = buildNodeAdjacencyList();
    const displayStreams = simulationStore.displayStreams;
    const interactionStreams = simulationStore.interactionStreams;
    
    // Create grouped structure
    const groupedStreams = displayStreams.map(outputStream => {
        // Get event streams connected to this output stream
        const connectedEventIds = nodeAdjacency[outputStream.id] || [];
        const connectedEventStreams = interactionStreams.filter(eventStream => 
            connectedEventIds.includes(eventStream.id)
        );
        
        return {
            outputStream,
            connectedEventStreams
        };
    });
    
    // Also include orphaned event streams (not connected to any output)
    const allConnectedEventIds = Object.values(nodeAdjacency).flat();
    const orphanedEventStreams = interactionStreams.filter(eventStream => 
        !allConnectedEventIds.includes(eventStream.id)
    );
    
    return {
        groupedStreams,
        orphanedEventStreams
    };
} 