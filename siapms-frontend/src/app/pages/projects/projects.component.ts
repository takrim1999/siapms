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
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">All Projects</h1>
        <div class="flex space-x-4">
          <input 
            type="text" 
            placeholder="Search projects..." 
            class="form-input max-w-xs"
            [(ngModel)]="searchTerm"
            (input)="filterProjects()"
          >
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading projects...</p>
      </div>

      <div *ngIf="!loading && filteredProjects.length === 0" class="text-center py-12">
        <p class="text-gray-600 text-lg">No projects found.</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let project of filteredProjects" class="project-card overflow-hidden">
          <div class="aspect-video bg-gray-200 overflow-hidden">
            <img 
              [src]="project.coverPhoto || '/placeholder.svg?height=200&width=300'" 
              [alt]="project.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            >
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-900">{{project.title}}</h3>
            <p class="text-gray-600 mb-4 line-clamp-3">{{project.description}}</p>
            
            <div class="flex justify-between items-center">
              <a 
                [routerLink]="['/projects', project.id]" 
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details →
              </a>
              
              <div class="flex space-x-2">
                <a 
                  *ngIf="project.githubLink" 
                  [href]="project.githubLink" 
                  target="_blank"
                  class="text-gray-500 hover:text-gray-700"
                  title="GitHub"
                >
                  <svg width="20" height="20" style="vertical-align: middle;" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                
                <a 
                  *ngIf="project.liveLink" 
                  [href]="project.liveLink" 
                  target="_blank"
                  class="text-gray-500 hover:text-gray-700"
                  title="Live Site"
                >
                  <svg width="20" height="20" style="vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
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
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase()),
    )
  }
}
