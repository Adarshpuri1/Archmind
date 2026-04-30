const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, default: 'custom' },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  data: {
    label: String,
    nodeType: { type: String, enum: ['service', 'database', 'cache', 'queue', 'gateway', 'client', 'cdn', 'loadbalancer', 'external'] },
    description: String,
    technology: String,
    color: String,
    icon: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  type: { type: String, default: 'smoothstep' },
  animated: { type: Boolean, default: false },
  label: String,
  data: {
    protocol: String,
    description: String,
  },
  style: mongoose.Schema.Types.Mixed,
  markerEnd: mongoose.Schema.Types.Mixed,
}, { _id: false });

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  requirement: {
    type: String,
    required: [true, 'Requirement is required'],
    maxlength: [2000, 'Requirement cannot exceed 2000 characters'],
  },
  architecture: {
    services: [mongoose.Schema.Types.Mixed],
    databases: [mongoose.Schema.Types.Mixed],
    apis: [mongoose.Schema.Types.Mixed],
    connections: [mongoose.Schema.Types.Mixed],
    scaling: [{
    strategies: [String],
    loadBalancing: String,
    caching: String,
    database: String,
    monitoring: [String]
  }],
    hld: String,
    lld: String,
    databaseSchema: String,
    apiStructure: mongoose.Schema.Types.Mixed,
    techStack: mongoose.Schema.Types.Mixed,
  },
  diagram: {
    nodes: [nodeSchema],
    edges: [edgeSchema],
    viewport: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      zoom: { type: Number, default: 1 },
    },
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'error'],
    default: 'draft',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  thumbnail: String,
}, {
  timestamps: true,
});

projectSchema.index({ user: 1, createdAt: -1 });
projectSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Project', projectSchema);
