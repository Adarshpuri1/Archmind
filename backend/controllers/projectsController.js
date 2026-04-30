const Project = require('../models/Project');

// @GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find({ user: req.user._id })
        .select('-architecture.hld -architecture.lld -diagram.nodes -diagram.edges')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json({ project });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const { title, description, isPublic, tags } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, isPublic, tags },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json({ project });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProject, deleteProject, updateProject };
