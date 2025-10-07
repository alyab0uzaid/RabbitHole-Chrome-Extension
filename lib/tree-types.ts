// Tree node structure for Wikipedia exploration
export interface WikiTreeNode {
  id: string;
  title: string;
  url: string;
  parentId: string | null;
  timestamp: number;
}

// Context type for determining parent node
export enum SourceContextType {
  TEXT_SELECTION = 'text_selection',
  MODAL_NAVIGATION = 'modal_navigation',
  SESSION_START = 'session_start',
  TREE_NAVIGATION = 'tree_navigation'
}

export interface SourceContext {
  type: SourceContextType;
  fromNodeId?: string;
}

// Tree state
export interface TreeState {
  nodes: WikiTreeNode[];
  activeNodeId: string | null;
  savedTrees: SavedTree[];
}

export interface SavedTree {
  id: string;
  name: string;
  nodes: WikiTreeNode[];
  createdAt: number;
}
