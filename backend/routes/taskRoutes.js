const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasks, 
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('admin'), createTask);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask) // Both Admin and Member can PUT (Admin edits, Member updates status)
  .delete(protect, authorize('admin'), deleteTask);

module.exports = router;
