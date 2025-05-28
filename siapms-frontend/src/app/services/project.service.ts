import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs"
import type { Project, CreateProjectRequest } from "../models/project.model"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private apiUrl = "http://localhost:3000/api"

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken()
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`)
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`)
  }

  getUserProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects/user`, {
      headers: this.getHeaders(),
    })
  }

  createProject(projectData: CreateProjectRequest): Observable<Project> {
    const formData = new FormData()
    formData.append("title", projectData.title)
    formData.append("description", projectData.description)
    formData.append("githubLink", projectData.githubLink)
    formData.append("liveLink", projectData.liveLink)
    formData.append("isPublic", projectData.isPublic.toString())

    if (projectData.coverPhoto) {
      formData.append("coverPhoto", projectData.coverPhoto)
    }

    projectData.screenshots.forEach((file, index) => {
      formData.append("screenshots", file)
    })

    return this.http.post<Project>(`${this.apiUrl}/projects`, formData, {
      headers: this.getHeaders(),
    })
  }

  updateProject(id: string, projectData: Partial<CreateProjectRequest>): Observable<Project> {
    const formData = new FormData()

    Object.keys(projectData).forEach((key) => {
      if (key === "screenshots" && Array.isArray(projectData[key])) {
        projectData[key]!.forEach((file: File) => {
          formData.append("screenshots", file)
        })
      } else if (key === "coverPhoto" && projectData[key]) {
        formData.append("coverPhoto", projectData[key] as File)
      } else if (projectData[key as keyof CreateProjectRequest] !== undefined) {
        formData.append(key, projectData[key as keyof CreateProjectRequest] as string)
      }
    })

    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, formData, {
      headers: this.getHeaders(),
    })
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`, {
      headers: this.getHeaders(),
    })
  }
}
