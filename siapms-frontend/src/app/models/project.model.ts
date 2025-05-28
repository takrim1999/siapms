export interface Project {
  id: string
  _id?: string
  title: string
  description: string
  coverPhoto: string
  screenshots: string[]
  githubLink: string
  liveLink: string
  isPublic: boolean
  userId: string
  createdAt: string
  updatedAt: string
  author?: {
    username: string
    profilePicture?: string
    bio?: string
  }
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  bio?: string
  website?: string
  twitter?: string
  linkedin?: string
  github?: string
  profilePicture?: string
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
