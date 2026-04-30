const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const { generateArchitecture, generateMockArchitecture } = require('../ai-engine/architectureGenerator');
const { buildDiagramFromArchitecture } = require('../services/diagramBuilder');

// @POST /api/architecture/generate
const generate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { requirement, title } = req.body;
    const userId = req.user._id;

    // Check generation limit
    const user = await User.findById(userId);
    if (user.generationsUsed >= user.generationsLimit) {
      return res.status(429).json({
        error: 'Generation limit reached. Upgrade your plan for more generations.',
        generationsUsed: user.generationsUsed,
        generationsLimit: user.generationsLimit,
      });
    }

    // Create project with generating status
    const project = await Project.create({
      user: userId,
      title: title || `Architecture for: ${requirement.slice(0, 50)}`,
      requirement,
      status: 'generating',
    });

    // Generate architecture using AI (with fallback)
    let architecture;
    try {
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
        architecture = await generateArchitecture(requirement);
      } else {
        console.log('⚠️  OpenAI key not set, using mock generator');
        architecture = generateMockArchitecture(requirement);
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError.message);
      architecture = generateMockArchitecture(requirement);
    }

    // Build React Flow diagram
    const diagram = buildDiagramFromArchitecture(architecture);

    // Update project with results
    project.architecture = architecture;
    project.diagram = { ...diagram, viewport: { x: 0, y: 0, zoom: 0.8 } };
    project.status = 'completed';
    project.title = architecture.title || project.title;
    await project.save();

    // Increment usage
    await User.findByIdAndUpdate(userId, { $inc: { generationsUsed: 1 } });

    res.json({
      message: 'Architecture generated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/architecture/:projectId/diagram
const updateDiagram = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { nodes, edges, viewport } = req.body;

    const project = await Project.findOne({ _id: projectId, user: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    project.diagram = { nodes, edges, viewport: viewport || project.diagram.viewport };
    await project.save();

    res.json({ message: 'Diagram updated successfully', diagram: project.diagram });
  } catch (error) {
    next(error);
  }
};

// @GET /api/architecture/:projectId
const getArchitecture = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({
      _id: projectId,
      $or: [{ user: req.user._id }, { isPublic: true }],
    }).populate('user', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

module.exports = { generate, updateDiagram, getArchitecture };
