const express = require('express');
const router = express.Router();
const { createTask, getTasks, assignTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('admin'), createTask);

router.route('/:taskId')
  .delete(protect, authorize('admin'), deleteTask);

router.route('/:taskId/assign')
  .put(protect, authorize('admin'), assignTask);

router.route('/:taskId/status')
  .put(protect, updateTaskStatus);

module.exports = router;
