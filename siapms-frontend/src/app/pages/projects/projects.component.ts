import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ProjectService } from "../../services/project.service"
import type { Project } from "../../models/project.model"

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-5 fw-bold">All Projects</h1>
          <input 
            type="text" 
            placeholder="Search projects..." 
          class="form-control w-auto"
            [(ngModel)]="searchTerm"
            (input)="filterProjects()"
          >
        </div>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
      </div>
        <p class="mt-2 text-secondary">Loading projects...</p>
      </div>

      <div *ngIf="!loading && filteredProjects.length === 0" class="text-center py-5">
        <p class="text-secondary fs-5">No projects found.</p>
      </div>

      <div class="row g-4">
        <div *ngFor="let project of filteredProjects" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm">
            <img 
              [src]="getImageUrl(project.coverPhoto)" 
              [alt]="project.title"
              class="card-img-top object-fit-cover"
              style="height: 180px; object-fit: cover;"
            >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{project.title}}</h5>
              <p class="card-text text-truncate">{{project.description}}</p>
              
              <!-- Creator Info -->
              <div class="d-flex align-items-center gap-2 mb-3">
                <a [routerLink]="['/profile', project.author.username]" class="text-decoration-none d-flex align-items-center gap-2">
                  <img 
                    *ngIf="project.author.profilePicture" 
                    [src]="getImageUrl(project.author.profilePicture)" 
                    [alt]="project.author.username"
                    class="rounded-circle"
                    style="width: 24px; height: 24px; object-fit: cover;"
                  />
                  <span class="text-muted small">by {{project.author.username}}</span>
                </a>
              </div>

              <div class="mt-auto d-flex justify-content-between align-items-center">
                <a [routerLink]="['/projects', project._id]" class="btn btn-primary btn-sm">View Details</a>
                <div class="d-flex gap-3">
                  <a *ngIf="project.githubLink" [href]="project.githubLink" target="_blank" class="text-dark" title="GitHub">
                    <i class="bi bi-github fs-4"></i>
                </a>
                  <a *ngIf="project.liveLink" [href]="project.liveLink" target="_blank" class="text-success" title="Live Demo">
                    <i class="bi bi-box-arrow-up-right fs-4"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = []
  filteredProjects: Project[] = []
  loading = true
  searchTerm = ""

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects()
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects
        this.filteredProjects = projects
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading projects:", error)
        this.loading = false
      },
    })
  }

  filterProjects(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProjects = this.projects
      return
    }

    this.filteredProjects = this.projects.filter(
      (project) =>
        project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.author.username.toLowerCase().includes(this.searchTerm.toLowerCase()),
    )
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return '/placeholder.svg?height=200&width=300';
    return `http://localhost:3000/${path}`;
  }
}
