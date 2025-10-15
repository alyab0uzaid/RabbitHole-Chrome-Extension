import React, { useState } from 'react';
import { useTree } from '@/lib/tree-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Play, Calendar, FileText } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

// Component to render a tree minimap using the same layout algorithm as the main tree
const TreeMinimap: React.FC<{ nodes: any[] }> = ({ nodes }) => {
  if (nodes.length === 0) return null;

  const svgWidth = 120;
  const svgHeight = 80;
  const padding = 8;
  const nodeWidth = 12;  // Width of rectangle
  const nodeHeight = 8;  // Height of rectangle

  // Use the same positioning algorithm as the main tree
  const calculatePositions = () => {
    const positions: { [id: string]: { x: number; y: number } } = {};
    
    if (nodes.length === 0) return positions;

    const horizontalSpacing = 25; // Scaled down for minimap
    const verticalSpacing = 20;   // Scaled down for minimap

    // Build parent-children map
    const childrenMap: { [id: string]: any[] } = {};
    nodes.forEach(node => {
      if (node.parentId) {
        if (!childrenMap[node.parentId]) {
          childrenMap[node.parentId] = [];
        }
        childrenMap[node.parentId].push(node);
      }
    });

    // Find root node
    const rootNode = nodes.find(node => node.parentId === null);
    if (!rootNode) return positions;

    // Position root node at center
    positions[rootNode.id] = { 
      x: svgWidth / 2, 
      y: padding + verticalSpacing / 2 
    };

    // Calculate total width needed for the entire tree
    const calculateTreeWidth = (node: any): number => {
      const children = childrenMap[node.id] || [];
      if (children.length === 0) return 1;
      return children.reduce((sum, child) => sum + calculateTreeWidth(child), 0);
    };

    const totalTreeWidth = calculateTreeWidth(rootNode);
    const startX = (svgWidth - (totalTreeWidth - 1) * horizontalSpacing) / 2;
    
    // Position nodes recursively starting from root
    let currentX = startX;
    
    const positionSubtree = (node: any, depth: number): { minX: number; maxX: number } => {
      const children = childrenMap[node.id] || [];
      
      if (children.length === 0) {
        // Leaf node - position at current X
        const x = currentX;
        currentX += horizontalSpacing;
        positions[node.id] = { x, y: padding + depth * verticalSpacing };
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
        positions[node.id] = { x, y: padding + depth * verticalSpacing };
      }
      
      return { minX: minChildX, maxX: maxChildX };
    };

    // Start positioning from root (root is already positioned at center)
    positionSubtree(rootNode, 0);

    return positions;
  };

  const nodePositions = calculatePositions();

  // Find bounds to center the tree
  const allPositions = Object.values(nodePositions);
  if (allPositions.length === 0) return null;

  const minX = Math.min(...allPositions.map(p => p.x));
  const maxX = Math.max(...allPositions.map(p => p.x));
  const minY = Math.min(...allPositions.map(p => p.y));
  const maxY = Math.max(...allPositions.map(p => p.y));

  const treeWidth = maxX - minX;
  const treeHeight = maxY - minY;
  const offsetX = (svgWidth - treeWidth) / 2 - minX;
  const offsetY = (svgHeight - treeHeight) / 2 - minY;

  return (
    <div className="w-32 h-full bg-muted/20 rounded-l-lg relative overflow-hidden flex items-center justify-center">
      <svg width={svgWidth} height={svgHeight} className="block">
        {/* Render edges first */}
        {nodes.map((node) => {
          if (node.parentId && nodePositions[node.parentId] && nodePositions[node.id]) {
            const parent = nodePositions[node.parentId];
            const child = nodePositions[node.id];
            return (
              <line
                key={`edge-${node.id}`}
                x1={parent.x + offsetX}
                y1={parent.y + offsetY}
                x2={child.x + offsetX}
                y2={child.y + offsetY}
                stroke="hsl(var(--muted-foreground) / 0.4)"
                strokeWidth="1.5"
              />
            );
          }
          return null;
        })}
        
        {/* Render nodes as rectangles */}
        {nodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;
          
          return (
            <rect
              key={node.id}
              x={pos.x + offsetX - nodeWidth / 2}
              y={pos.y + offsetY - nodeHeight / 2}
              width={nodeWidth}
              height={nodeHeight}
              rx="2"
              fill="hsl(var(--card) / 0.3)"
              stroke={node.parentId === null ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

interface SessionsPageProps {
  onSwitchToTree?: () => void;
}

export function SessionsPage({ onSwitchToTree }: SessionsPageProps) {
  const { savedTrees, loadTree, deleteSavedTree } = useTree();

  const handleLoadSession = (treeId: string) => {
    console.log('[Rabbit Holes] Loading tree:', treeId);

    // Load the tree and switch to tree view
    loadTree(treeId, () => {
      console.log('[Rabbit Holes] Switching to tree view');
      if (onSwitchToTree) {
        onSwitchToTree();
      }
    });
  };

  const handleDeleteSession = (treeId: string) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this rabbit hole? This cannot be undone.'
    );
    if (!confirm) return;

    deleteSavedTree(treeId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Rabbit Holes</h1>
      </div>
      {/* Saved Sessions List */}
      <div className="flex-1 overflow-y-auto px-6">
        {savedTrees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center">
            <div className="text-6xl">📚</div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Rabbit Holes Yet</h3>
              <p className="text-sm">
                Your explorations will appear here once you start diving down Wikipedia rabbit holes.
                <br />
                Build a tree and it will be automatically saved!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-1 pb-6">
            {savedTrees.map((tree) => (
              <Card key={tree.id} className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="flex">
                  {/* Tree Minimap - Left Side */}
                  <div className="flex-shrink-0">
                    <TreeMinimap nodes={tree.nodes} />
                  </div>
                  
                  {/* Card Content - Right Side */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="mb-3">
                      <h4 className="font-semibold text-base mb-1 truncate">{tree.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {tree.nodes.length} {tree.nodes.length === 1 ? 'node' : 'nodes'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(tree.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleLoadSession(tree.id)}
                        size="sm"
                        className="flex-1 gap-1"
                      >
                        <Play className="h-3 w-3" />
                        Dive In
                      </Button>
                      <Button
                        onClick={() => handleDeleteSession(tree.id)}
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
