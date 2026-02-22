import type { Node, Edge } from '@xyflow/react';
import type { WikiTreeNode } from './tree-types';

export interface WikiNodeData {
  title: string;
  url: string;
  isActive: boolean;
  isRoot?: boolean;
}

export interface TreeLayoutOptions {
  horizontalSpacing: number;
  verticalSpacing: number;
  nodeType: string;
  edgeColor: string;
  primaryColor: string;
}

// Helper to get computed color from CSS variable
function getComputedColor(cssVar: string, opacity: number = 1): string {
  if (typeof window === 'undefined') return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : '#c8c8c8';
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(cssVar).trim();
  if (!value) return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : '#c8c8c8';

  const tempEl = document.createElement('div');
  tempEl.style.position = 'absolute';
  tempEl.style.visibility = 'hidden';
  tempEl.style.color = `oklch(${value})`;
  document.body.appendChild(tempEl);
  const computedColor = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);

  const match = computedColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const [r, g, b] = match.slice(1).map(Number);
    if (r < 50 && g < 50 && b < 50) {
      return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : 'rgb(200, 200, 200)';
    }
    return opacity < 1 ? `rgba(${r}, ${g}, ${b}, ${opacity})` : `rgb(${r}, ${g}, ${b})`;
  }
  return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : '#c8c8c8';
}

export function convertToFlowNodes(
  treeNodes: WikiTreeNode[],
  activeNodeId: string | null,
  options?: Partial<TreeLayoutOptions>
): { nodes: Node<WikiNodeData>[]; edges: Edge[] } {
  const nodes: Node<WikiNodeData>[] = [];
  const edges: Edge[] = [];

  const edgeColor = options?.edgeColor ?? getComputedColor('--border', 1);
  const primaryColor = options?.primaryColor ?? getComputedColor('--primary');
  const nodeType = options?.nodeType ?? 'wikiNode';
  const horizontalSpacing = options?.horizontalSpacing ?? 240;
  const verticalSpacing = options?.verticalSpacing ?? 140;

  if (treeNodes.length === 0) return { nodes, edges };

  const nodePositions: { [id: string]: { x: number; y: number } } = {};
  const childrenMap: { [id: string]: WikiTreeNode[] } = {};

  treeNodes.forEach(node => {
    if (node.parentId) {
      if (!childrenMap[node.parentId]) childrenMap[node.parentId] = [];
      childrenMap[node.parentId].push(node);
    }
  });

  const rootNode = treeNodes.find(node => node.parentId === null);
  if (!rootNode) return { nodes, edges };

  nodePositions[rootNode.id] = { x: 0, y: 0 };

  const calculateTreeWidth = (node: WikiTreeNode): number => {
    const children = childrenMap[node.id] || [];
    if (children.length === 0) return 1;
    return children.reduce((sum, child) => sum + calculateTreeWidth(child), 0);
  };

  const totalTreeWidth = calculateTreeWidth(rootNode);
  let currentX = -(totalTreeWidth - 1) * horizontalSpacing / 2;

  const positionSubtree = (node: WikiTreeNode, depth: number): { minX: number; maxX: number } => {
    const children = childrenMap[node.id] || [];

    if (children.length === 0) {
      const x = currentX;
      currentX += horizontalSpacing;
      nodePositions[node.id] = { x, y: depth * verticalSpacing };
      return { minX: x, maxX: x };
    }

    const childRanges = children.map(child => positionSubtree(child, depth + 1));
    const minChildX = Math.min(...childRanges.map(r => r.minX));
    const maxChildX = Math.max(...childRanges.map(r => r.maxX));

    if (node.id !== rootNode.id) {
      nodePositions[node.id] = { x: (minChildX + maxChildX) / 2, y: depth * verticalSpacing };
    }
    return { minX: minChildX, maxX: maxChildX };
  };

  positionSubtree(rootNode, 0);

  // Prevent overlaps
  const positionArray = Object.entries(nodePositions).sort((a, b) => {
    if (a[1].y !== b[1].y) return a[1].y - b[1].y;
    return a[1].x - b[1].x;
  });

  for (let i = 0; i < positionArray.length; i++) {
    const [nodeId, pos] = positionArray[i];
    for (let j = 0; j < i; j++) {
      const [, otherPos] = positionArray[j];
      if (Math.abs(pos.y - otherPos.y) < verticalSpacing * 0.5) {
        const distance = Math.abs(pos.x - otherPos.x);
        if (distance < horizontalSpacing) {
          const direction = pos.x > otherPos.x ? 1 : -1;
          nodePositions[nodeId] = { ...pos, x: otherPos.x + direction * horizontalSpacing };
          positionArray[i][1] = nodePositions[nodeId];
        }
      }
    }
  }

  treeNodes.forEach(node => {
    const pos = nodePositions[node.id];
    nodes.push({
      id: node.id,
      type: nodeType,
      position: pos,
      data: {
        title: node.title,
        url: node.url,
        isActive: node.id === activeNodeId,
        isRoot: node.parentId === null
      } as WikiNodeData
    });

    if (node.parentId) {
      edges.push({
        id: `edge-${node.parentId}-${node.id}`,
        source: node.parentId,
        target: node.id,
        type: 'smoothstep',
        animated: node.id === activeNodeId,
        style: {
          strokeWidth: 2,
          stroke: node.id === activeNodeId ? primaryColor : edgeColor
        },
        pathOptions: { borderRadius: 0, stepPosition: 0, offset: 5 }
      });
    }
  });

  return { nodes, edges };
}
