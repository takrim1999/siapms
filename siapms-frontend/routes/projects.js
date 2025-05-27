const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const { projects, saveProjects } = require("../data/projects")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// Get all public projects
router.get("/", (req, res) => {
  try {
    const publicProjects = projects
      .filter((project) => project.isPublic)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(publicProjects)
  } catch (error) {
    console.error("Get projects error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get project by ID
router.get("/:id", (req, res) => {
  try {
    const project = projects.find((p) => p.id === req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Only return public projects or projects owned by the authenticated user
    const token = req.headers.authorization?.split(" ")[1]
    let userId = null

    if (token) {
      try {
        const jwt = require("jsonwebtoken")
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production")
        userId = decoded.userId
      } catch (error) {
        // Token invalid, continue as anonymous user
      }
    }

    if (!project.isPublic && project.userId !== userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(project)
  } catch (error) {
    console.error("Get project error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get user's projects (authenticated)
router.get("/user", authenticateToken, (req, res) => {
  try {
    const userProjects = projects
      .filter((project) => project.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(userProjects)
  } catch (error) {
    console.error("Get user projects error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Create new project (authenticated)
router.post(
  "/",
  authenticateToken,
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "screenshots", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      const { title, description, githubLink, liveLink, isPublic } = req.body

      // Validation
      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" })
      }

      // Process uploaded files
      let coverPhoto = ""
      let screenshots = []

      if (req.files["coverPhoto"]) {
        coverPhoto = `/uploads/${req.files["coverPhoto"][0].filename}`
      }

      if (req.files["screenshots"]) {
        screenshots = req.files["screenshots"].map((file) => `/uploads/${file.filename}`)
      }

      // Create new project
      const newProject = {
        id: uuidv4(),
        title,
        description,
        coverPhoto,
        screenshots,
        githubLink: githubLink || "",
        liveLink: liveLink || "",
        isPublic: isPublic === "true",
        userId: req.user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      projects.push(newProject)
      saveProjects(projects)

      res.status(201).json(newProject)
    } catch (error) {
      console.error("Create project error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  },
)

// Update project (authenticated)
router.put(
  "/:id",
  authenticateToken,
  upload.fields([
    { name: "coverPhoto", maxCount: 1 },
    { name: "screenshots", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      const projectIndex = projects.findIndex((p) => p.id === req.params.id)

      if (projectIndex === -1) {
        return res.status(404).json({ message: "Project not found" })
      }

      const project = projects[projectIndex]

      // Check ownership
      if (project.userId !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" })
      }

      // Update project fields
      const { title, description, githubLink, liveLink, isPublic } = req.body

      if (title) project.title = title
      if (description) project.description = description
      if (githubLink !== undefined) project.githubLink = githubLink
      if (liveLink !== undefined) project.liveLink = liveLink
      if (isPublic !== undefined) project.isPublic = isPublic === "true"

      // Handle file uploads
      if (req.files["coverPhoto"]) {
        // Delete old cover photo
        if (project.coverPhoto) {
          const oldPath = path.join(__dirname, "..", project.coverPhoto)
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath)
          }
        }
        project.coverPhoto = `/uploads/${req.files["coverPhoto"][0].filename}`
      }

      if (req.files["screenshots"]) {
        // Delete old screenshots
        project.screenshots.forEach((screenshot) => {
          const oldPath = path.join(__dirname, "..", screenshot)
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath)
          }
        })
        project.screenshots = req.files["screenshots"].map((file) => `/uploads/${file.filename}`)
      }

      project.updatedAt = new Date().toISOString()
      projects[projectIndex] = project
      saveProjects(projects)

      res.json(project)
    } catch (error) {
      console.error("Update project error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  },
)

// Delete project (authenticated)
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const projectIndex = projects.findIndex((p) => p.id === req.params.id)

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" })
    }

    const project = projects[projectIndex]

    // Check ownership
    if (project.userId !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Delete associated files
    if (project.coverPhoto) {
      const coverPath = path.join(__dirname, "..", project.coverPhoto)
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath)
      }
    }

    project.screenshots.forEach((screenshot) => {
      const screenshotPath = path.join(__dirname, "..", screenshot)
      if (fs.existsSync(screenshotPath)) {
        fs.unlinkSync(screenshotPath)
      }
    })

    // Remove project from array
    projects.splice(projectIndex, 1)
    saveProjects(projects)

    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
