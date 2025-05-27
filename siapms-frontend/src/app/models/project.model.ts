export interface Project {
  id: string
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
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
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
