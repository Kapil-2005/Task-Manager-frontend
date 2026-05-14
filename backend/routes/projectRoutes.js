const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/projects - Get all projects
// POST /api/projects - Create project
router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('admin'), createProject);

// GET /api/projects/:id - Single project details
// PUT /api/projects/:id - Update project
// DELETE /api/projects/:id - Delete project
router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, authorize('admin'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

module.exports = router;
