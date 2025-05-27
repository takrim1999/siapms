const fs = require("fs")
const path = require("path")

const projectsFile = path.join(__dirname, "projects.json")

// Initialize projects array
let projects = []

// Load projects from file
const loadProjects = () => {
  try {
    if (fs.existsSync(projectsFile)) {
      const data = fs.readFileSync(projectsFile, "utf8")
      projects = JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading projects:", error)
    projects = []
  }
}

// Save projects to file
const saveProjects = (projectsData) => {
  try {
    fs.writeFileSync(projectsFile, JSON.stringify(projectsData, null, 2))
  } catch (error) {
    console.error("Error saving projects:", error)
  }
}

// Load projects on module initialization
loadProjects()

module.exports = { projects, saveProjects }
