const multer = require("multer")

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB." })
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files uploaded." })
    }
  }

  // File type errors
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" })
  }

  // Default error
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  })
}

module.exports = { errorHandler }
