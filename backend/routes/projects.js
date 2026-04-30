const express = require('express');
const { getProjects, getProject, deleteProject, updateProject } = require('../controllers/projectsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProject);
router.put('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);

module.exports = router;
