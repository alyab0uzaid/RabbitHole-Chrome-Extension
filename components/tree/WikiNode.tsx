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
      className={`group px-5 py-3 rounded-sm border-2 bg-white shadow-sm min-w-[160px] max-w-[220px] transition-all duration-200 ${
        data.isActive
          ? 'border-primary shadow-md shadow-primary/10 scale-105'
          : 'border-border hover:border-primary/60 hover:shadow-md'
      }`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-2 !h-2 !border-0 !bg-transparent !opacity-0 group-hover:!opacity-100 group-hover:!bg-primary/50 transition-opacity" 
      />

      <div className={`text-base font-medium truncate transition-colors ${
        data.isActive ? 'text-primary' : 'text-foreground'
      }`} title={data.title}>
        {data.title}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-2 !h-2 !border-0 !bg-transparent !opacity-0 group-hover:!opacity-100 group-hover:!bg-primary/50 transition-opacity" 
      />
    </div>
  );
}

export default memo(WikiNode);
