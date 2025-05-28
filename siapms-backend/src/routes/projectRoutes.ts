import express from 'express';
import Project from '../../models/Project';
import { auth } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all public projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isPublic: true })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'username profilePicture bio website twitter linkedin github');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.isPublic && (!req.user || project.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new project (protected route)
router.post('/', auth, upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const { title, description, githubLink, liveLink, isPublic } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const project = new Project({
      title,
      description,
      githubLink,
      liveLink,
      isPublic: isPublic === 'true',
      author: req.user._id,
      coverPhoto: files.coverPhoto?.[0] ? `uploads/${files.coverPhoto[0].filename}` : undefined,
      screenshots: files.screenshots?.map(file => `uploads/${file.filename}`) || []
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (protected route)
router.put('/:id', auth, upload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 }
]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, githubLink, liveLink, isPublic } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const updateData: any = {
      title,
      description,
      githubLink,
      liveLink,
      isPublic: isPublic === 'true'
    };

    if (files.coverPhoto?.[0]) {
      updateData.coverPhoto = `uploads/${files.coverPhoto[0].filename}`;
    }

    if (files.screenshots?.length) {
      updateData.screenshots = files.screenshots.map(file => `uploads/${file.filename}`);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('author', 'username profilePicture');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 