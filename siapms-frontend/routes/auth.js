const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const { users, saveUsers } = require("../data/users")
const { validateEmail, validatePassword } = require("../utils/validation")

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email || user.username === username)

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    // Remove password from response
    const { password: _, ...userResponse } = newUser

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    // Remove password from response
    const { password: _, ...userResponse } = user

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get current user
router.get("/me", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = users.find((u) => u.id === decoded.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { password: _, ...userResponse } = user
    res.json({ user: userResponse })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(401).json({ message: "Invalid token" })
  }
})

module.exports = router
