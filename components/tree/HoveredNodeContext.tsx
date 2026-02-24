import React, { createContext, useContext, useState, useCallback } from 'react';

export interface HoveredNode {
  title: string;
  url: string;
  /** Screen position at hover time (for fallback). */
  x: number;
  y: number;
  /** Flow-space position so we can convert to screen when viewport changes. */
  flowX: number;
  flowY: number;
  flowWidth: number;
  flowHeight: number;
}

interface HoveredNodeContextValue {
  hoveredNode: HoveredNode | null;
  setHoveredNode: (node: HoveredNode | null) => void;
}

const HoveredNodeContext = createContext<HoveredNodeContextValue | undefined>(undefined);

export function HoveredNodeProvider({ children }: { children: React.ReactNode }) {
  const [hoveredNode, setHoveredNodeState] = useState<HoveredNode | null>(null);
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const setHoveredNode = useCallback((node: HoveredNode | null) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (node) {
      hoverTimeoutRef.current = setTimeout(() => setHoveredNodeState(node), 400);
    } else {
      setHoveredNodeState(null);
    }
  }, []);

  React.useEffect(() => () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, []);

  return (
    <HoveredNodeContext.Provider value={{ hoveredNode, setHoveredNode }}>
      {children}
    </HoveredNodeContext.Provider>
  );
}

export function useHoveredNode() {
  const ctx = useContext(HoveredNodeContext);
  if (!ctx) throw new Error('useHoveredNode must be used within HoveredNodeProvider');
  return ctx;
}
