import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const NODE_ICONS = {
  service: '⚙️',
  gateway: '🔀',
  client: '💻',
  external: '🌐',
  database: '🗄️',
  cache: '⚡',
  queue: '📨',
  search: '🔍',
  loadbalancer: '⚖️',
  cdn: '🌍',
  monitoring: '📊',
};

const NODE_COLORS = {
  service: { border: '#6366f1', bg: 'rgba(99,102,241,0.08)', dot: '#6366f1' },
  gateway: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', dot: '#f59e0b' },
  client: { border: '#10b981', bg: 'rgba(16,185,129,0.08)', dot: '#10b981' },
  external: { border: '#6b7280', bg: 'rgba(107,114,128,0.08)', dot: '#6b7280' },
  database: { border: '#3b82f6', bg: 'rgba(59,130,246,0.08)', dot: '#3b82f6' },
  cache: { border: '#ef4444', bg: 'rgba(239,68,68,0.08)', dot: '#ef4444' },
  queue: { border: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', dot: '#8b5cf6' },
  search: { border: '#f97316', bg: 'rgba(249,115,22,0.08)', dot: '#f97316' },
  loadbalancer: { border: '#14b8a6', bg: 'rgba(20,184,166,0.08)', dot: '#14b8a6' },
  cdn: { border: '#ec4899', bg: 'rgba(236,72,153,0.08)', dot: '#ec4899' },
  monitoring: { border: '#78716c', bg: 'rgba(120,113,108,0.08)', dot: '#78716c' },
};

const ArchitectureNode = memo(({ data, selected }) => {
  const colors = NODE_COLORS[data.nodeType] || NODE_COLORS.service;
  const icon = NODE_ICONS[data.nodeType] || '🔧';

  return (
    <div
      style={{
        minWidth: 160,
        maxWidth: 200,
        background: '#1e1e35',
        border: `1.5px solid ${selected ? colors.border : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        padding: '12px 14px',
        boxShadow: selected
          ? `0 0 0 2px ${colors.border}33, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.3)',
        cursor: 'grab',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        background: colors.border,
        borderRadius: '14px 14px 0 0',
      }} />

      {/* Background color wash */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: colors.bg,
        pointerEvents: 'none',
      }} />

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: colors.border, width: 8, height: 8, border: '2px solid #0f0f1a' }}
      />

      <div style={{ position: 'relative' }}>
        {/* Icon + Type badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: colors.border,
            background: `${colors.border}20`,
            padding: '2px 6px',
            borderRadius: 6,
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 600,
          }}>
            {data.nodeType}
          </span>
        </div>

        {/* Label */}
        <div style={{
          fontWeight: 600,
          fontSize: 13,
          color: '#f1f5f9',
          lineHeight: 1.3,
          marginBottom: 4,
          fontFamily: '"DM Sans", sans-serif',
        }}>
          {data.label}
        </div>

        {/* Technology */}
        {data.technology && (
          <div style={{
            fontSize: 10,
            color: '#64748b',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {data.technology}
          </div>
        )}

        {/* Port */}
        {data.port && (
          <div style={{
            marginTop: 4,
            fontSize: 9,
            color: '#475569',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            :{data.port}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: colors.border, width: 8, height: 8, border: '2px solid #0f0f1a' }}
      />
    </div>
  );
});

ArchitectureNode.displayName = 'ArchitectureNode';
export default ArchitectureNode;
