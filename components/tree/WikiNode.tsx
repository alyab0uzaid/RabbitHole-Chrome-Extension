import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';

export interface WikiNodeData extends Record<string, unknown> {
  title: string;
  url: string;
  isActive: boolean;
}

function WikiNode({ data }: NodeProps<Node<WikiNodeData>>) {
  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-background shadow-md min-w-[150px] max-w-[200px] transition-all ${
        data.isActive
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="text-sm font-medium text-foreground truncate" title={data.title}>
        {data.title}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(WikiNode);
