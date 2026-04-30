const express = require('express');
const { body } = require('express-validator');
const { generate, updateDiagram, getArchitecture } = require('../controllers/architectureController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/generate', authenticate, [
  body('requirement').trim().isLength({ min: 10, max: 2000 }).withMessage('Requirement must be 10-2000 characters'),
], generate);

router.get('/:projectId', authenticate, getArchitecture);
router.put('/:projectId/diagram', authenticate, updateDiagram);

module.exports = router;
