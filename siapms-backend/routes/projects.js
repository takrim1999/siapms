const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all public projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isPublic: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    const projectsWithId = projects.map(project => {
      const obj = project.toObject();
      obj.id = obj._id;
      return obj;
    });
    res.json(projectsWithId);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get user's projects
router.get('/my-projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ author: req.userId })
      .sort({ createdAt: -1 });
    const projectsWithId = projects.map(project => {
      const obj = project.toObject();
      obj.id = obj._id;
      return obj;
    });
    res.json(projectsWithId);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Create new project
router.post('/', auth, upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, description, githubLink, liveLink, isPublic } = req.body;

    const coverPhoto = req.files.coverPhoto ? req.files.coverPhoto[0].path : null;
    const screenshots = req.files.screenshots ? req.files.screenshots.map(file => file.path) : [];

    const project = new Project({
      title,
      description,
      coverPhoto,
      screenshots,
      githubLink,
      liveLink,
      isPublic: isPublic === 'true',
      author: req.userId
    });

    await project.save();
    const projectObj = project.toObject();
    projectObj.id = projectObj._id;
    res.status(201).json(projectObj);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const projectObj = project.toObject();
    projectObj.id = projectObj._id;
    res.json(projectObj);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Update project
router.put('/:id', auth, upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, author: req.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updates = req.body;
    if (req.files.coverPhoto) {
      updates.coverPhoto = req.files.coverPhoto[0].path;
    }
    if (req.files.screenshots) {
      updates.screenshots = req.files.screenshots.map(file => file.path);
    }

    Object.assign(project, updates);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      author: req.userId
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router; 