import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WikiTreeNode, SourceContext, SourceContextType, TreeState, SavedTree } from './tree-types';
import { browser } from 'wxt/browser';

interface TreeContextValue extends TreeState {
  addNode: (title: string, url: string, context: SourceContext) => string;
  setActiveNode: (nodeId: string | null) => void;
  clearTree: () => void;
  saveTree: (name: string) => void;
  updateTree: (treeId: string, name: string) => void;
  loadTree: (treeId: string, onLoadCallback?: () => void) => void;
  deleteSavedTree: (treeId: string) => void;
  currentSessionId: string | null;
  currentSessionName: string;
  setCurrentSessionName: (name: string) => void;
  isLoadedFromSave: boolean;
}

const TreeContext = createContext<TreeContextValue | undefined>(undefined);

const STORAGE_KEY_CURRENT_SESSION = 'rabbithole_current_session';
const STORAGE_KEY_SAVED_SESSIONS = 'rabbithole_saved_sessions';

export function TreeProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<WikiTreeNode[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [savedTrees, setSavedTrees] = useState<SavedTree[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSessionName, setCurrentSessionName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedFromSave, setIsLoadedFromSave] = useState(false);

  // Use a ref to store the latest activeNodeId
  const activeNodeIdRef = React.useRef<string | null>(null);

  // Update ref whenever activeNodeId changes
  React.useEffect(() => {
    activeNodeIdRef.current = activeNodeId;
  }, [activeNodeId]);

  // Load current session from storage on mount
  useEffect(() => {
    async function loadFromStorage() {
      try {
        const [currentData, savedData] = await Promise.all([
          browser.storage.local.get(STORAGE_KEY_CURRENT_SESSION),
          browser.storage.local.get(STORAGE_KEY_SAVED_SESSIONS)
        ]);

        if (currentData[STORAGE_KEY_CURRENT_SESSION]) {
          const session = currentData[STORAGE_KEY_CURRENT_SESSION];
          setNodes(session.nodes || []);
          setActiveNodeId(session.activeNodeId || null);
          setCurrentSessionId(session.sessionId || null);
          console.log('[TreeContext] Loaded current session from storage:', session.nodes?.length, 'nodes');
        }

        if (savedData[STORAGE_KEY_SAVED_SESSIONS]) {
          setSavedTrees(savedData[STORAGE_KEY_SAVED_SESSIONS] || []);
          console.log('[TreeContext] Loaded saved sessions from storage');
        }
      } catch (error) {
        console.error('[TreeContext] Error loading from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadFromStorage();
  }, []);

  // Listen for tracking navigation messages from background script
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.messageType === 'trackNavigation') {
        const { articleTitle, articleUrl, sessionId, tabId } = message;
        console.log('[TreeContext] Received trackNavigation:', articleTitle, 'for tab:', tabId);

        // Check if node already exists in current tree
        setNodes(prevNodes => {
          const existingNode = prevNodes.find(node => node.title === articleTitle);

          if (existingNode) {
            setActiveNodeId(existingNode.id);
            return prevNodes;
          } else {
            // Determine context type
            const contextType = prevNodes.length === 0
              ? SourceContextType.SESSION_START
              : SourceContextType.MODAL_NAVIGATION;

            // Create new node
            const newNode: WikiTreeNode = {
              id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: articleTitle,
              url: articleUrl,
              parentId: activeNodeIdRef.current,
              timestamp: Date.now()
            };

            console.log('[TreeContext] Adding node:', newNode);
            setActiveNodeId(newNode.id);

            // Set default session name if this is the first node
            if (prevNodes.length === 0 && !currentSessionName) {
              setCurrentSessionName(`Session ${new Date().toLocaleString()}`);
            }

            return [...prevNodes, newNode];
          }
        });

        // Update current session ID if provided, BUT only if we don't already have a loaded tree
        // Once a tree is loaded, we keep its ID forever - never switch to a new session
        if (sessionId && sessionId !== currentSessionId && !currentSessionId?.startsWith('loaded-')) {
          setCurrentSessionId(sessionId);
        }
      } else if (message.messageType === 'clearSession') {
        // Wikipedia tab was closed, clear the tree
        console.log('[TreeContext] Received clearSession, clearing tree');
        setNodes([]);
        setActiveNodeId(null);
        setCurrentSessionId(null);
        setCurrentSessionName('');
      } else if (message.messageType === 'restoreSession') {
        // Session is being restored for a specific tab
        const { nodes: restoredNodes, activeNodeId: restoredActiveNodeId, sessionId: restoredSessionId, tabId: restoredTabId } = message;
        console.log('[TreeContext] Restoring session for tab', restoredTabId, 'with', restoredNodes?.length || 0, 'nodes');
        
        if (restoredNodes && restoredNodes.length > 0) {
          setNodes(restoredNodes);
          setActiveNodeId(restoredActiveNodeId);
          setCurrentSessionId(restoredSessionId);
          // Update session name if we have a default one
          if (!currentSessionName) {
            setCurrentSessionName(`Session ${new Date().toLocaleString()}`);
          }
        }
      } else if (message.messageType === 'switchToTabTree') {
        // Switch to show the tree for a specific tab
        const { tabId: targetTabId, nodes: tabNodes, activeNodeId: tabActiveNodeId, sessionId: tabSessionId, sessionName: tabSessionName } = message;
        console.log('[TreeContext] Switching to tree for tab', targetTabId, 'with', tabNodes?.length || 0, 'nodes');
        
        setNodes(tabNodes || []);
        setActiveNodeId(tabActiveNodeId || null);
        setCurrentSessionId(tabSessionId || null);
        setCurrentSessionName(tabSessionName || '');
      }
    };

    browser.runtime.onMessage.addListener(messageListener);

    return () => {
      browser.runtime.onMessage.removeListener(messageListener);
    };
  }, [currentSessionId, currentSessionName]);

  // Persist current session to storage whenever it changes
  useEffect(() => {
    if (!isLoaded) return; // Don't persist during initial load

    async function persistCurrentSession() {
      try {
        await browser.storage.local.set({
          [STORAGE_KEY_CURRENT_SESSION]: {
            nodes,
            activeNodeId,
            sessionId: currentSessionId
          }
        });
        console.log('[TreeContext] Persisted current session to storage');
      } catch (error) {
        console.error('[TreeContext] Error persisting to storage:', error);
      }
    }

    persistCurrentSession();
  }, [nodes, activeNodeId, currentSessionId, isLoaded]);

  // Persist saved trees whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    async function persistSavedTrees() {
      try {
        await browser.storage.local.set({
          [STORAGE_KEY_SAVED_SESSIONS]: savedTrees
        });
        console.log('[TreeContext] Persisted saved sessions to storage');
      } catch (error) {
        console.error('[TreeContext] Error persisting saved sessions:', error);
      }
    }

    persistSavedTrees();
  }, [savedTrees, isLoaded]);

  // Auto-save: When nodes or name change, auto-update the saved tree
  useEffect(() => {
    if (!isLoaded || nodes.length === 0) return;
    if (!currentSessionId || !currentSessionName) return;

    // Debounce auto-save
    const autoSaveTimer = setTimeout(() => {
      console.log('[TreeContext] Auto-saving session:', currentSessionName);

      // Check if this is a loaded tree
      const isLoadedTree = currentSessionId.startsWith('loaded-');
      const treeId = isLoadedTree ? currentSessionId.replace('loaded-', '') : currentSessionId;

      // Find if tree already exists
      const existingTree = savedTrees.find(t => t.id === treeId);

      if (existingTree) {
        // ALWAYS update existing tree, never create duplicates
        console.log('[TreeContext] Updating existing tree:', treeId);
        setSavedTrees(prev => prev.map(tree =>
          tree.id === treeId
            ? { ...tree, name: currentSessionName, nodes: [...nodes], createdAt: Date.now() }
            : tree
        ));
      } else {
        // Create new tree ONLY if it doesn't exist yet
        console.log('[TreeContext] Creating new tree:', treeId);
        const newTree: SavedTree = {
          id: treeId,
          name: currentSessionName,
          nodes: [...nodes],
          createdAt: Date.now()
        };
        setSavedTrees(prev => [...prev, newTree]);

        // Lock the session ID to this tree - once created, never change ID
        if (!isLoadedTree) {
          console.log('[TreeContext] Locking session ID to created tree:', treeId);
          setCurrentSessionId(`loaded-${treeId}`);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(autoSaveTimer);
  }, [nodes, currentSessionName, currentSessionId, isLoaded]);

  // Add a new node to the tree
  const addNode = useCallback((title: string, url: string, context: SourceContext): string => {
    console.log('[TreeContext] addNode called:', { title, context, currentNodes: nodes.length });

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

    console.log('[TreeContext] Adding node:', newNode);
    setNodes(prev => {
      const updated = [...prev, newNode];
      console.log('[TreeContext] Nodes updated, count:', updated.length);
      return updated;
    });
    setActiveNodeId(newNode.id);

    return newNode.id;
  }, [nodes.length]);

  // Set active node (for tree navigation)
  const setActiveNode = useCallback((nodeId: string | null) => {
    setActiveNodeId(nodeId);
  }, []);

  // Clear the entire tree
  const clearTree = useCallback(() => {
    setNodes([]);
    setActiveNodeId(null);
    setCurrentSessionName('');
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

  // Update an existing tree with current nodes
  const updateTree = useCallback((treeId: string, name: string) => {
    console.log('[TreeContext] Updating tree:', treeId, 'with', nodes.length, 'nodes');
    setSavedTrees(prev => prev.map(tree =>
      tree.id === treeId
        ? { ...tree, name, nodes: [...nodes], createdAt: Date.now() }
        : tree
    ));
  }, [nodes]);

  // Load a saved tree
  const loadTree = useCallback((treeId: string, onLoadCallback?: () => void) => {
    const tree = savedTrees.find(t => t.id === treeId);
    if (tree) {
      console.log('[TreeContext] Loading saved tree:', tree.name, 'with', tree.nodes.length, 'nodes');
      setIsLoadedFromSave(true);
      setNodes(tree.nodes);
      setCurrentSessionName(tree.name); // Load the name

      // Find the last visited node (the one with the latest timestamp)
      const lastVisitedNode = tree.nodes.reduce((latest, node) => {
        return !latest || node.timestamp > latest.timestamp ? node : latest;
      }, tree.nodes[0]);

      // Set active to the last visited node
      setActiveNodeId(lastVisitedNode?.id || null);

      // Mark this as a loaded/view-only session, not a live tracking session
      // This prevents the background script from thinking it's a live session
      setCurrentSessionId(`loaded-${tree.id}`);

      // Tell background script this is a loaded tree with the initial article
      browser.runtime.sendMessage({
        messageType: 'setLoadedTreeInfo',
        originalTreeId: tree.id,
        originalTreeName: tree.name,
        initialArticleTitle: lastVisitedNode?.title
      }).catch(err => console.log('[TreeContext] Could not notify background:', err));

      // Clear the tree from background storage to prevent save prompt if user just closes without changes
      browser.storage.local.set({
        rabbithole_current_session: {
          nodes: [],
          activeNodeId: null,
          sessionId: null
        }
      }).then(() => {
        console.log('[TreeContext] Cleared background tracking for loaded tree');
      });

      // Navigate to the last visited node
      if (lastVisitedNode) {
        console.log('[TreeContext] Navigating to last visited node:', lastVisitedNode.title);

        // Check if current tab is Wikipedia - if so, reuse it; otherwise create new tab
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          const currentTab = tabs[0];
          if (currentTab?.url?.includes('wikipedia.org')) {
            // Reuse current Wikipedia tab
            console.log('[TreeContext] Reusing current Wikipedia tab');
            browser.tabs.update(currentTab.id!, { url: lastVisitedNode.url });
          } else {
            // Create new tab
            console.log('[TreeContext] Creating new tab for Wikipedia');
            browser.tabs.create({ url: lastVisitedNode.url, active: true });
          }
        });
      }

      // Call the callback to switch sidebar to tree view
      if (onLoadCallback) {
        onLoadCallback();
      }

      // Reset the flag after a brief delay to allow UI to update
      setTimeout(() => setIsLoadedFromSave(false), 1000);
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
    updateTree,
    loadTree,
    deleteSavedTree,
    currentSessionId,
    currentSessionName,
    setCurrentSessionName,
    isLoadedFromSave
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
