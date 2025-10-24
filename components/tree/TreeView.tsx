import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  MiniMap,
  ConnectionLineType,
  Panel,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTree } from '@/lib/tree-context';
import { WikiTreeNode, SourceContextType } from '@/lib/tree-types';
import WikiNode, { WikiNodeData } from './WikiNode';
import type { NodeTypes } from '@xyflow/react';
import { Network, Edit2, Check, X } from 'lucide-react';

const nodeTypes: NodeTypes = {
  wikiNode: WikiNode
};

// Convert tree data to React Flow format with proper branching layout and collision avoidance
function convertToFlowNodes(treeNodes: WikiTreeNode[], activeNodeId: string | null): { nodes: Node<WikiNodeData>[]; edges: Edge[] } {
  const nodes: Node<WikiNodeData>[] = [];
  const edges: Edge[] = [];

  if (treeNodes.length === 0) return { nodes, edges };

  const nodePositions: { [id: string]: { x: number; y: number } } = {};
  const horizontalSpacing = 240; // Increased spacing
  const verticalSpacing = 140;   // Increased spacing
  const nodeWidth = 220;         // Approximate node width
  const nodeHeight = 60;         // Approximate node height

  // Build parent-children map
  const childrenMap: { [id: string]: WikiTreeNode[] } = {};
  treeNodes.forEach(node => {
    if (node.parentId) {
      if (!childrenMap[node.parentId]) {
        childrenMap[node.parentId] = [];
      }
      childrenMap[node.parentId].push(node);
    }
  });

  // Find root node
  const rootNode = treeNodes.find(node => node.parentId === null);
  if (!rootNode) return { nodes, edges };

  // Position root node at center (anchored)
  nodePositions[rootNode.id] = { x: 0, y: 0 };

  // Calculate total width needed for the entire tree
  const calculateTreeWidth = (node: WikiTreeNode): number => {
    const children = childrenMap[node.id] || [];
    if (children.length === 0) return 1;
    return children.reduce((sum, child) => sum + calculateTreeWidth(child), 0);
  };

  const totalTreeWidth = calculateTreeWidth(rootNode);
  const startX = -(totalTreeWidth - 1) * horizontalSpacing / 2;
  
  // Position nodes recursively starting from root
  let currentX = startX;
  
  const positionSubtree = (node: WikiTreeNode, depth: number): { minX: number; maxX: number } => {
    const children = childrenMap[node.id] || [];
    
    if (children.length === 0) {
      // Leaf node - position at current X
      const x = currentX;
      currentX += horizontalSpacing;
      nodePositions[node.id] = { x, y: depth * verticalSpacing };
      return { minX: x, maxX: x };
    }

    // Position all children first to get their range
    const childRanges = children.map(child => {
      const range = positionSubtree(child, depth + 1);
      return range;
    });

    // Calculate the range of all children
    const minChildX = Math.min(...childRanges.map(r => r.minX));
    const maxChildX = Math.max(...childRanges.map(r => r.maxX));
    
    // For non-root nodes, position parent at the center of its children
    if (node.id !== rootNode.id) {
      const x = (minChildX + maxChildX) / 2;
      nodePositions[node.id] = { x, y: depth * verticalSpacing };
    }
    
    return { minX: minChildX, maxX: maxChildX };
  };

  // Start positioning from root (root is already positioned at center)
  positionSubtree(rootNode, 0);

  // Post-process to prevent overlaps
  const preventOverlaps = () => {
    const positionArray = Object.entries(nodePositions);
    
    // Sort by y-coordinate (depth), then by x-coordinate
    positionArray.sort((a, b) => {
      if (a[1].y !== b[1].y) return a[1].y - b[1].y;
      return a[1].x - b[1].x;
    });

    // Check for overlaps and adjust positions
    for (let i = 0; i < positionArray.length; i++) {
      const [nodeId, pos] = positionArray[i];
      
      // Check against all previous nodes at the same depth
      for (let j = 0; j < i; j++) {
        const [otherNodeId, otherPos] = positionArray[j];
        
        // Only check nodes at the same depth (same y-coordinate)
        if (Math.abs(pos.y - otherPos.y) < verticalSpacing * 0.5) {
          const distance = Math.abs(pos.x - otherPos.x);
          const minDistance = horizontalSpacing;
          
          // If nodes are too close, adjust the current node's position
          if (distance < minDistance) {
            const direction = pos.x > otherPos.x ? 1 : -1;
            const newX = otherPos.x + direction * minDistance;
            nodePositions[nodeId] = { ...pos, x: newX };
            positionArray[i][1] = nodePositions[nodeId];
          }
        }
      }
    }
  };

  // Apply overlap prevention
  preventOverlaps();

  // Create nodes with calculated positions
  treeNodes.forEach(node => {
    const pos = nodePositions[node.id];
    nodes.push({
      id: node.id,
      type: 'wikiNode',
      position: pos,
      data: {
        title: node.title,
        url: node.url,
        isActive: node.id === activeNodeId
      } as WikiNodeData
    });

    // Create edge to parent
    if (node.parentId) {
      edges.push({
        id: `edge-${node.parentId}-${node.id}`,
        source: node.parentId,
        target: node.id,
        type: ConnectionLineType.SmoothStep,
        animated: node.id === activeNodeId,
        style: {
          strokeWidth: 2,
          stroke: node.id === activeNodeId 
            ? 'hsl(var(--primary) / 0.6)' 
            : 'hsl(var(--muted-foreground) / 0.2)'
        }
      });
    }
  });

  return { nodes, edges };
}

interface TreeViewProps {
  onNodeClick?: (nodeId: string, nodeData: { title: string; url: string; isActive: boolean }) => void;
}

export default function TreeView({ onNodeClick }: TreeViewProps = {}) {
  const { nodes: treeNodes, activeNodeId, setActiveNode, currentSessionName, setCurrentSessionName } = useTree();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const reactFlowInstance = useRef<any>(null);
  
  // Get the root node name for display
  const rootNodeName = treeNodes.find(node => node.parentId === null)?.title || 'Untitled Session';

  console.log('[TreeView] Rendering with treeNodes:', treeNodes.length, 'nodes');

  // Removed title editing functions

  // Compute nodes and edges from tree data
  const { nodes: flowNodes, edges: flowEdges } = useMemo(
    () => convertToFlowNodes(treeNodes, activeNodeId),
    [treeNodes, activeNodeId]
  );

  // Center view on active node when it changes
  useEffect(() => {
    if (activeNodeId && reactFlowInstance.current?.fitView) {
      const node = flowNodes.find(n => n.id === activeNodeId);
      if (node) {
        reactFlowInstance.current.fitView({
          nodes: [{ id: activeNodeId }],
          duration: 500,
          padding: 0.6
        });
      }
    }
  }, [activeNodeId, flowNodes]);

  // Fit view when nodes change (new node added)
  useEffect(() => {
    if (reactFlowInstance.current?.fitView && flowNodes.length > 0) {
      reactFlowInstance.current.fitView({
        duration: 300,
        padding: 0.8
      });
    }
  }, [flowNodes.length]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (reactFlowInstance.current?.fitView) {
        reactFlowInstance.current.fitView({
          duration: 200,
          padding: 0.8
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<WikiNodeData>) => {
      setActiveNode(node.id);
      if (onNodeClick && node.data) {
        onNodeClick(node.id, node.data);
      }
    },
    [setActiveNode, onNodeClick]
  );

  const handleStartEdit = () => {
    setEditedTitle(rootNodeName);
    setIsEditingTitle(true);
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      // TODO: Implement rename functionality
      console.log('Renaming session to:', editedTitle);
      setIsEditingTitle(false);
      setEditedTitle('');
    }
  };

  // Remove the empty state - always show the tree view
  // if (treeNodes.length === 0) {
  //   return null;
  // }

  console.log('[TreeView] Rendering ReactFlow with', flowNodes.length, 'nodes');

  return (
    <div className="w-full h-full flex flex-col">
      {/* Clean Header */}
      <div className="px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center justify-between group">
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-2xl font-semibold bg-transparent border-b-2 border-primary focus:outline-none"
                  style={{ fontFamily: 'Montaga, serif' }}
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  disabled={!editedTitle.trim()}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Montaga, serif' }}>
                  {rootNodeName}
                </h1>
                <button
                  onClick={handleStartEdit}
                  className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {treeNodes.length} {treeNodes.length === 1 ? 'node' : 'nodes'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tree View */}
      <div className="flex-1 relative">
        <ReactFlow
          ref={reactFlowInstance}
          nodes={flowNodes}
          edges={flowEdges}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView={false}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            style: { 
              strokeWidth: 2,
              stroke: 'hsl(var(--border))'
            },
            animated: false
          }}
          onInit={(instance) => {
            reactFlowInstance.current = instance;
            // Initial fit view with much more padding to zoom out significantly
            setTimeout(() => {
              if (instance.fitView) {
                instance.fitView({
                  duration: 300,
                  padding: 0.8
                });
              }
            }, 100);
          }}
        >
          <Controls 
            position="bottom-left"
            className="!border-border !bg-background/90 backdrop-blur-sm !shadow-lg [&_button]:!border-border [&_button]:!bg-background/90 [&_button]:hover:!bg-muted/50 [&_button]:!text-foreground" 
          />
        </ReactFlow>
      </div>
    </div>
  );
}
