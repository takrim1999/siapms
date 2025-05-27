const fs = require("fs")
const path = require("path")

const usersFile = path.join(__dirname, "users.json")

// Initialize users array
let users = []

// Load users from file
const loadUsers = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, "utf8")
      users = JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading users:", error)
    users = []
  }
}

// Save users to file
const saveUsers = (usersData) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2))
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

// Load users on module initialization
loadUsers()

module.exports = { users, saveUsers }
