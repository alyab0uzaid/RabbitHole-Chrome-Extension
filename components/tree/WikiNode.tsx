import React, { memo, useRef } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { useHoveredNode } from './HoveredNodeContext';

export interface WikiNodeData extends Record<string, unknown> {
  title: string;
  url: string;
  isActive: boolean;
}

function WikiNode({ data, id, positionAbsoluteX, positionAbsoluteY, width, height }: NodeProps<Node<WikiNodeData>>) {
  const { setHoveredNode } = useHoveredNode();
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const w = width ?? rect.width;
      const h = height ?? rect.height;
      setHoveredNode({
        title: data.title,
        url: data.url,
        x: rect.left + rect.width / 2,
        y: rect.top,
        flowX: positionAbsoluteX ?? 0,
        flowY: positionAbsoluteY ?? 0,
        flowWidth: w,
        flowHeight: h,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div
      ref={divRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

      <div
        className={`text-base font-medium truncate transition-colors ${
          data.isActive ? 'text-primary' : 'text-foreground'
        }`}
        title={data.title}
      >
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
