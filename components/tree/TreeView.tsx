import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  ConnectionLineType,
  Panel,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTree } from '@/lib/tree-context';
import { WikiTreeNode, SourceContextType } from '@/lib/tree-types';
import WikiNode, { WikiNodeData } from './WikiNode';
import type { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  wikiNode: WikiNode
};

// Convert tree data to React Flow format with proper branching layout
function convertToFlowNodes(treeNodes: WikiTreeNode[], activeNodeId: string | null): { nodes: Node<WikiNodeData>[]; edges: Edge[] } {
  const nodes: Node<WikiNodeData>[] = [];
  const edges: Edge[] = [];

  if (treeNodes.length === 0) return { nodes, edges };

  const nodePositions: { [id: string]: { x: number; y: number } } = {};
  const horizontalSpacing = 180;
  const verticalSpacing = 120;

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
  let globalX = 0;
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
  const [titleInputValue, setTitleInputValue] = useState('');
  const reactFlowInstance = useRef<any>(null);

  console.log('[TreeView] Rendering with treeNodes:', treeNodes.length, 'nodes');

  const handleTitleClick = useCallback(() => {
    setTitleInputValue(currentSessionName);
    setIsEditingTitle(true);
  }, [currentSessionName]);

  const handleTitleBlur = useCallback(() => {
    if (titleInputValue.trim()) {
      setCurrentSessionName(titleInputValue.trim());
    }
    setIsEditingTitle(false);
  }, [titleInputValue, setCurrentSessionName]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  }, []);

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
          padding: 0.2
        });
      }
    }
  }, [activeNodeId, flowNodes]);

  // Fit view when nodes change (new node added)
  useEffect(() => {
    if (reactFlowInstance.current?.fitView && flowNodes.length > 0) {
      reactFlowInstance.current.fitView({
        duration: 300,
        padding: 0.1
      });
    }
  }, [flowNodes.length]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (reactFlowInstance.current?.fitView) {
        reactFlowInstance.current.fitView({
          duration: 200,
          padding: 0.1
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

  if (treeNodes.length === 0) {
    console.log('[TreeView] Showing empty state');
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center">
        <div className="text-6xl">🕳️</div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Active Research Session</h3>
          <p className="text-sm">
            Highlight text on any page and click the preview card to start exploring Wikipedia.
            <br />
            Your journey will be tracked automatically.
          </p>
        </div>
      </div>
    );
  }

  console.log('[TreeView] Rendering ReactFlow with', flowNodes.length, 'nodes');

  return (
    <div className="w-full h-full">
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
            stroke: 'hsl(var(--muted-foreground) / 0.2)'
          },
          animated: false
        }}
        onInit={(instance) => {
          reactFlowInstance.current = instance;
          // Initial fit view
          setTimeout(() => {
            if (instance.fitView) {
              instance.fitView({
                duration: 300,
                padding: 0.1
              });
            }
          }, 100);
        }}
      >
        <Controls className="!border-border !bg-background/80 backdrop-blur-sm !shadow-sm [&_button]:!border-border [&_button]:!bg-background/80 [&_button]:hover:!bg-muted/50" />
        <Panel position="top-left" className="bg-background/80 backdrop-blur-sm p-3 rounded-md border">
          <div className="flex flex-col gap-2 min-w-[250px]">
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInputValue}
                onChange={(e) => setTitleInputValue(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                className="text-lg font-semibold bg-transparent border-none outline-none focus:outline-none px-0 w-full"
              />
            ) : (
              <h2
                onClick={handleTitleClick}
                className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-1 -ml-1 rounded transition-colors"
                title="Click to edit"
              >
                {currentSessionName || 'Untitled Session'}
              </h2>
            )}
            <div className="text-xs text-muted-foreground">
              {treeNodes.length} {treeNodes.length === 1 ? 'article' : 'articles'}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
