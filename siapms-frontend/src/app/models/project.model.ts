export interface Project {
  _id: string
  title: string
  description: string
  coverPhoto?: string
  screenshots: string[]
  githubLink?: string
  liveLink?: string
  isPublic: boolean
  author: User
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  username: string
  email: string
  profilePicture?: string
  bio?: string
  website?: string
  twitter?: string
  linkedin?: string
  github?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  title: string
  description: string
  coverPhoto: File | null
  screenshots: File[]
  githubLink: string
  liveLink: string
  isPublic: boolean
}
