import React, { useMemo, useEffect, useRef } from 'react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { NodeTypes } from '@xyflow/react';
import { convertToFlowNodes } from '@/lib/tree-layout';
import type { WikiTreeNode } from '@/lib/tree-types';
import CompactNode from './CompactNode';

const nodeTypes: NodeTypes = {
  compactNode: CompactNode
};

interface TreePreviewFlowProps {
  nodes: WikiTreeNode[];
}

export default function TreePreviewFlow({ nodes }: TreePreviewFlowProps) {
  const reactFlowRef = useRef<any>(null);

  const { nodes: flowNodes, edges: flowEdges } = useMemo(
    () =>
      convertToFlowNodes(nodes, null, {
        nodeType: 'compactNode',
        horizontalSpacing: 28,
        verticalSpacing: 22
      }),
    [nodes]
  );

  useEffect(() => {
    if (reactFlowRef.current?.fitView && flowNodes.length > 0) {
      reactFlowRef.current.fitView({
        padding: 0.3,
        duration: 0
      });
    }
  }, [flowNodes]);

  if (nodes.length === 0) return null;

  return (
    <div className="w-full h-full min-w-[160px] min-h-[100px]">
      <ReactFlow
        ref={reactFlowRef}
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
      />
    </div>
  );
}
