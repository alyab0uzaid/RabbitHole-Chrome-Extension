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
import { Network, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const nodeTypes: NodeTypes = {
  wikiNode: WikiNode
};

// Helper to get computed color from CSS variable with optional opacity
function getComputedColor(cssVar: string, opacity: number = 1): string {
  if (typeof window === 'undefined') return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : '#c8c8c8';
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(cssVar).trim();
  if (!value) return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : '#c8c8c8';
  
  // Create temp element to get computed color
  const tempEl = document.createElement('div');
  tempEl.style.position = 'absolute';
  tempEl.style.visibility = 'hidden';
  tempEl.style.color = `oklch(${value})`;
  document.body.appendChild(tempEl);
  
  const computedColor = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);
  
  // Extract RGB and apply opacity if needed
  const match = computedColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    // If color is too dark (black or near-black), use a light grey fallback
    if (r < 50 && g < 50 && b < 50) {
      return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : 'rgb(200, 200, 200)';
    }
    
    if (opacity < 1) {
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  return opacity < 1 ? `rgba(200, 200, 200, ${opacity})` : '#c8c8c8';
}

// Convert tree data to React Flow format with proper branching layout and collision avoidance
function convertToFlowNodes(treeNodes: WikiTreeNode[], activeNodeId: string | null): { nodes: Node<WikiNodeData>[]; edges: Edge[] } {
  const nodes: Node<WikiNodeData>[] = [];
  const edges: Edge[] = [];
  
  // Get colors once - same as node outlines (--border)
  const edgeColor = getComputedColor('--border', 1);
  const primaryColor = getComputedColor('--primary');

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
            ? primaryColor 
            : edgeColor
        },
        pathOptions: {
          radius: 8 // Corner radius for smooth step edges
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
  
  const rootNode = treeNodes.find(node => node.parentId === null);
  const sessionName = currentSessionName || rootNode?.title || 'Untitled Session';

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
    setEditedTitle(sessionName);
    setIsEditingTitle(true);
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      console.log('Renaming session to:', editedTitle);
      setCurrentSessionName(editedTitle.trim());
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
      <div className="px-6 pt-2 pb-3 border-b border-border bg-background">
        <div className="space-y-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editedTitle.trim()) {
                    handleSaveEdit();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                onBlur={() => {
                  if (editedTitle.trim()) {
                    handleSaveEdit();
                  } else {
                    handleCancelEdit();
                  }
                }}
                className="text-3xl font-medium h-10 border-0 border-b border-primary/50 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none bg-transparent px-0"
                style={{ fontFamily: 'var(--font-serif)' }}
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="group/title flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
            >
              <h1 
                className="text-3xl font-medium text-foreground" 
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {sessionName}
              </h1>
              <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover/title:opacity-100 transition-opacity" />
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            {rootNode && (
              <>
                <span>{new Date(rootNode.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span>·</span>
              </>
            )}
            <span>{treeNodes.length} {treeNodes.length === 1 ? 'node' : 'nodes'}</span>
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
          connectionLineOptions={{
            pathOptions: {
              radius: 8 // Corner radius for connection lines
            }
          }}
          fitView={false}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            style: { 
              strokeWidth: 2,
              stroke: getComputedColor('--border', 1)
            },
            animated: false,
            pathOptions: {
              radius: 8 // Corner radius for smooth step edges
            }
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
