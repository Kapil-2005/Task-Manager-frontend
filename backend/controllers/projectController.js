const Project = require('../models/Project');

// Create project
const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'member') {
      query.members = req.user._id;
    }
    const projects = await Project.find(query);
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    if (req.user.role === 'member' && !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }
    
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update project (including members)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
