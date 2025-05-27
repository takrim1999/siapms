const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  return password && password.length >= 6
}

const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUrl,
}
