// Converts AI-generated architecture JSON into React Flow nodes and edges

const NODE_TYPE_CONFIG = {
  service: { color: '#6366f1', bgColor: '#eef2ff', icon: '⚙️' },
  gateway: { color: '#f59e0b', bgColor: '#fffbeb', icon: '🔀' },
  client: { color: '#10b981', bgColor: '#ecfdf5', icon: '💻' },
  external: { color: '#6b7280', bgColor: '#f9fafb', icon: '🌐' },
  database: { color: '#3b82f6', bgColor: '#eff6ff', icon: '🗄️' },
  cache: { color: '#ef4444', bgColor: '#fef2f2', icon: '⚡' },
  queue: { color: '#8b5cf6', bgColor: '#f5f3ff', icon: '📨' },
  search: { color: '#f97316', bgColor: '#fff7ed', icon: '🔍' },
  loadbalancer: { color: '#14b8a6', bgColor: '#f0fdfa', icon: '⚖️' },
  cdn: { color: '#ec4899', bgColor: '#fdf2f8', icon: '🌍' },
  monitoring: { color: '#78716c', bgColor: '#fafaf9', icon: '📊' },
  default: { color: '#64748b', bgColor: '#f8fafc', icon: '🔧' },
};

const LAYOUT_COLUMNS = {
  client: 0,
  cdn: 0,
  loadbalancer: 1,
  gateway: 2,
  service: 3,
  database: 4,
  cache: 4,
  queue: 4,
  search: 4,
  monitoring: 5,
  external: 5,
};

const buildDiagramFromArchitecture = (architecture) => {
  const nodes = [];
  const edges = [];
  const idToIndex = {};

  // Collect all entities
  const allEntities = [
    ...(architecture.services || []).map(s => ({ ...s, nodeCategory: s.type || 'service' })),
    ...(architecture.databases || []).map(d => ({ ...d, nodeCategory: d.type || 'database' })),
    ...(architecture.infrastructure || []).map(i => ({ ...i, nodeCategory: i.type || 'loadbalancer' })),
  ];

  // Group by column
  const columnGroups = {};
  allEntities.forEach(entity => {
    const col = LAYOUT_COLUMNS[entity.nodeCategory] ?? 3;
    if (!columnGroups[col]) columnGroups[col] = [];
    columnGroups[col].push(entity);
  });

  const COL_WIDTH = 220;
  const ROW_HEIGHT = 130;
  const START_X = 50;
  const START_Y = 60;

  // Build nodes with auto-layout
  const sortedCols = Object.keys(columnGroups).sort((a, b) => a - b);
  sortedCols.forEach(col => {
    const entities = columnGroups[col];
    entities.forEach((entity, rowIdx) => {
      const config = NODE_TYPE_CONFIG[entity.nodeCategory] || NODE_TYPE_CONFIG.default;
      const node = {
        id: entity.id,
        type: 'architectureNode',
        position: {
          x: START_X + parseInt(col) * COL_WIDTH,
          y: START_Y + rowIdx * ROW_HEIGHT,
        },
        data: {
          label: entity.name,
          nodeType: entity.nodeCategory,
          technology: entity.technology || '',
          description: entity.description || '',
          color: config.color,
          bgColor: config.bgColor,
          icon: config.icon,
          port: entity.port,
          responsibilities: entity.responsibilities || [],
          collections: entity.collections || [],
        },
      };
      nodes.push(node);
      idToIndex[entity.id] = node;
    });
  });

  // Build edges from connections
  const validIds = new Set(nodes.map(n => n.id));
  const edgeIds = new Set();

  (architecture.connections || []).forEach((conn, idx) => {
    if (!validIds.has(conn.from) || !validIds.has(conn.to)) return;
    const edgeId = `edge-${conn.from}-${conn.to}`;
    if (edgeIds.has(edgeId)) return;
    edgeIds.add(edgeId);

    const isAsync = conn.async || false;
    const edge = {
      id: edgeId,
      source: conn.from,
      target: conn.to,
      type: 'smoothstep',
      animated: isAsync,
      label: conn.protocol || '',
      data: {
        protocol: conn.protocol,
        description: conn.description,
        async: isAsync,
      },
      style: {
        stroke: isAsync ? '#8b5cf6' : '#94a3b8',
        strokeWidth: 2,
        strokeDasharray: isAsync ? '5,5' : 'none',
      },
      markerEnd: {
        type: 'arrowclosed',
        color: isAsync ? '#8b5cf6' : '#94a3b8',
      },
      labelStyle: { fontSize: 10, fill: '#64748b' },
      labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
    };
    edges.push(edge);
  });

  return { nodes, edges };
};

module.exports = { buildDiagramFromArchitecture };
