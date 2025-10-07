import React, { createContext, useContext, useState, useCallback } from 'react';
import { WikiTreeNode, SourceContext, SourceContextType, TreeState, SavedTree } from './tree-types';

interface TreeContextValue extends TreeState {
  addNode: (title: string, url: string, context: SourceContext) => string;
  setActiveNode: (nodeId: string | null) => void;
  clearTree: () => void;
  saveTree: (name: string) => void;
  loadTree: (treeId: string) => void;
  deleteSavedTree: (treeId: string) => void;
}

const TreeContext = createContext<TreeContextValue | undefined>(undefined);

export function TreeProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<WikiTreeNode[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [savedTrees, setSavedTrees] = useState<SavedTree[]>([]);

  // Use a ref to store the latest activeNodeId
  const activeNodeIdRef = React.useRef<string | null>(null);

  // Update ref whenever activeNodeId changes
  React.useEffect(() => {
    activeNodeIdRef.current = activeNodeId;
  }, [activeNodeId]);

  // Add a new node to the tree
  const addNode = useCallback((title: string, url: string, context: SourceContext): string => {
    // Determine parent based on context type and current active node
    let parentId: string | null = null;

    switch (context.type) {
      case SourceContextType.TEXT_SELECTION:
      case SourceContextType.MODAL_NAVIGATION:
        // Use the ref to get the current active node
        parentId = activeNodeIdRef.current;
        break;
      case SourceContextType.SESSION_START:
      case SourceContextType.TREE_NAVIGATION:
        parentId = null;
        break;
      default:
        parentId = activeNodeIdRef.current;
    }

    const newNode: WikiTreeNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      url,
      parentId,
      timestamp: Date.now()
    };

    setNodes(prev => [...prev, newNode]);
    setActiveNodeId(newNode.id);

    return newNode.id;
  }, []);

  // Set active node (for tree navigation)
  const setActiveNode = useCallback((nodeId: string | null) => {
    setActiveNodeId(nodeId);
  }, []);

  // Clear the entire tree
  const clearTree = useCallback(() => {
    setNodes([]);
    setActiveNodeId(null);
  }, []);

  // Save current tree with a name
  const saveTree = useCallback((name: string) => {
    const savedTree: SavedTree = {
      id: `tree-${Date.now()}`,
      name,
      nodes: [...nodes],
      createdAt: Date.now()
    };

    setSavedTrees(prev => [...prev, savedTree]);
  }, [nodes]);

  // Load a saved tree
  const loadTree = useCallback((treeId: string) => {
    const tree = savedTrees.find(t => t.id === treeId);
    if (tree) {
      setNodes(tree.nodes);
      // Set active to the last node in the tree
      const lastNode = tree.nodes[tree.nodes.length - 1];
      setActiveNodeId(lastNode?.id || null);
    }
  }, [savedTrees]);

  // Delete a saved tree
  const deleteSavedTree = useCallback((treeId: string) => {
    setSavedTrees(prev => prev.filter(t => t.id !== treeId));
  }, []);

  const value: TreeContextValue = {
    nodes,
    activeNodeId,
    savedTrees,
    addNode,
    setActiveNode,
    clearTree,
    saveTree,
    loadTree,
    deleteSavedTree
  };

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}

export function useTree() {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within TreeProvider');
  }
  return context;
}
