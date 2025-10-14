import React, { useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  ConnectionLineType,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTree } from '@/lib/tree-context';
import { WikiTreeNode, SourceContextType } from '@/lib/tree-types';
import WikiNode, { WikiNodeData } from './WikiNode';
import type { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  wikiNode: WikiNode
};

// Convert tree data to React Flow format
function convertToFlowNodes(treeNodes: WikiTreeNode[], activeNodeId: string | null): { nodes: Node<WikiNodeData>[]; edges: Edge[] } {
  const nodes: Node<WikiNodeData>[] = [];
  const edges: Edge[] = [];

  // Calculate positions using a simple tree layout
  const nodesByLevel: { [level: number]: WikiTreeNode[] } = {};
  const nodeLevels: { [id: string]: number } = {};

  // Calculate levels
  const calculateLevel = (node: WikiTreeNode): number => {
    if (nodeLevels[node.id] !== undefined) {
      return nodeLevels[node.id];
    }

    if (node.parentId === null) {
      nodeLevels[node.id] = 0;
      return 0;
    }

    const parent = treeNodes.find(n => n.id === node.parentId);
    if (!parent) {
      nodeLevels[node.id] = 0;
      return 0;
    }

    const level = calculateLevel(parent) + 1;
    nodeLevels[node.id] = level;
    return level;
  };

  // Group nodes by level
  treeNodes.forEach(node => {
    const level = calculateLevel(node);
    if (!nodesByLevel[level]) {
      nodesByLevel[level] = [];
    }
    nodesByLevel[level].push(node);
  });

  // Position nodes
  const horizontalSpacing = 250;
  const verticalSpacing = 100;

  treeNodes.forEach(node => {
    const level = nodeLevels[node.id];
    const nodesAtLevel = nodesByLevel[level];
    const indexAtLevel = nodesAtLevel.indexOf(node);
    const totalAtLevel = nodesAtLevel.length;

    // Center nodes at each level
    const x = (indexAtLevel - (totalAtLevel - 1) / 2) * horizontalSpacing;
    const y = level * verticalSpacing;

    nodes.push({
      id: node.id,
      type: 'wikiNode',
      position: { x, y },
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
        animated: node.id === activeNodeId
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
        nodes={flowNodes}
        edges={flowEdges}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Background />
        <Controls />
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
