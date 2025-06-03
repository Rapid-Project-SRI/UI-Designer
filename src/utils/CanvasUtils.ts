import { Edge, Node } from 'react-flow-renderer';
import { designStore } from '../storage/DesignStore';

/**
 * Generates visualizer edges for the React Flow graph based on widget adjacency.
 * @param {Record<string, string[]>} widgetAdj - Adjacency list mapping widget IDs to their connected widget IDs.
 * @returns {Edge[]} Array of React Flow Edge objects for visualization.
 */
export function generateVisualizerEdges(widgetAdj: Record<string, string[]>): Edge[] {
   const edges: Edge[] = [];
   for (const [sourceId, targets] of Object.entries(widgetAdj)) {
      for (const targetId of targets) {
         edges.push({
            id: `viz-${targetId}-${sourceId}`,
            source: sourceId,
            target: targetId,
            type: 'default',
            animated: true,
            style: { stroke: '#FF00FF', strokeWidth: 2 }
         });
      }
   }
   return edges;
}

/**
 * Creates a signature string representing all widgets' selectedStreams for effect dependencies.
 * @returns {string} Signature string for selectedStreams of all widgets.
 */
export function getSelectedStreamsSignature(): string {
   return designStore.widgets
      .map(w => `${w.id}:${(w.selectedStreams || []).join(',')}`)
      .sort()
      .join('|');
}

/**
 * Rebuilds the React Flow state for nodes and edges from the design store widgets.
 * @param {Function} setNodes - React state setter for nodes.
 * @param {Function} setEdges - React state setter for edges.
 * @returns {void}
 */
export function rebuildReactFlowState(setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void): void {
   setNodes(
      designStore.widgets.map((widget) => ({
         id: widget.id,
         type: widget.type,
         data: { widgetId: widget.id },
         position: widget.position,
      }) as Node)
   );
   // Assuming widgets don't have edges, but if they do, handle them similarly
   setEdges([]);
}
