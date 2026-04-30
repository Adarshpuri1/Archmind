import React, { useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import ArchitectureNode from './ArchitectureNode';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const nodeTypes = { architectureNode: ArchitectureNode };

const DiagramCanvas = ({ initialNodes = [], initialEdges = [], onSave, readOnly = false }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params) => {
      if (readOnly) return;
      setEdges((eds) => addEdge({
        ...params,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        markerEnd: { type: 'arrowclosed', color: '#94a3b8' },
      }, eds));
    },
    [readOnly]
  );

  const handleAddNode = () => {
    const id = `custom-${Date.now()}`;
    const newNode = {
      id,
      type: 'architectureNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'New Service',
        nodeType: 'service',
        technology: 'Node.js',
        description: 'Custom service',
        color: '#6366f1',
        bgColor: 'rgba(99,102,241,0.08)',
        icon: '⚙️',
      },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success('Node added');
  };

  const handleDeleteSelected = () => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
    toast.success('Deleted selected elements');
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ nodes, edges });
      toast.success('Diagram saved!');
    }
  };

  const nodeColor = (node) => {
    const colors = {
      service: '#6366f1', gateway: '#f59e0b', client: '#10b981',
      database: '#3b82f6', cache: '#ef4444', queue: '#8b5cf6',
      loadbalancer: '#14b8a6', cdn: '#ec4899', monitoring: '#78716c',
    };
    return colors[node.data?.nodeType] || '#64748b';
  };

  return (
    <div className="relative w-full h-full" ref={reactFlowWrapper}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"
          style={{ background: '#1e1e35', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: '6px 10px' }}>
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-300 hover:bg-brand-500/10 transition-colors"
          >
            <Plus size={13} /> Add Node
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={13} /> Delete Selected
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 text-white hover:bg-brand-500 transition-colors"
          >
            Save
          </button>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={0}
          maskColor="rgba(15,15,26,0.8)"
        />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(99,102,241,0.15)" />
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;
