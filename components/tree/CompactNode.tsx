import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';

export interface CompactNodeData {
  title: string;
  url: string;
  isActive: boolean;
  isRoot?: boolean;
}

function CompactNode({ data }: NodeProps<Node<CompactNodeData>>) {
  return (
    <div
      className={`rounded-full border-2 border-border transition-colors ${
        data.isActive
          ? 'bg-primary w-4 h-4'
          : data.isRoot
            ? 'bg-muted-foreground w-3 h-3'
            : 'bg-primary/40 w-3 h-3'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-0 !h-0 !border-0 !min-w-0 !min-h-0" />
      <Handle type="source" position={Position.Bottom} className="!w-0 !h-0 !border-0 !min-w-0 !min-h-0" />
    </div>
  );
}

export default memo(CompactNode);
