import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { ProjectService } from "../../services/project.service"
import { AuthService } from "../../services/auth.service"
import type { Project, User } from "../../models/project.model"

@Component({
  selector: "app-project-detail",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading project...</p>
    </div>

    <div *ngIf="!loading && !project" class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
      <p class="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
      <a routerLink="/projects" class="btn-primary">Back to Projects</a>
    </div>

    <div *ngIf="project" class="max-w-4xl mx-auto">
      <!-- Creator Profile Section -->
      <div class="flex flex-col gap-2 mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-1">{{project.title}}</h1>
      </div>
      <!-- Creator Chip -->
      <div *ngIf="project.author" class="d-flex align-items-center gap-2 mb-3">
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
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>Created: {{formatDate(project.createdAt)}}</span>
            <span *ngIf="project.updatedAt !== project.createdAt">
              Updated: {{formatDate(project.updatedAt)}}
            </span>
            <span *ngIf="!project.isPublic" class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Private
            </span>
          </div>
        </div>
        
        <!-- Action buttons for project owner -->
        <div *ngIf="isOwner" class="flex space-x-2">
          <button (click)="editProject()" class="btn-secondary">
            Edit Project
          </button>
          <button (click)="deleteProject()" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <!-- Cover Image -->
      <div *ngIf="project.coverPhoto" class="mb-8">
        <div class="w-full aspect-[3/1] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <img 
            [src]="getImageUrl(project.coverPhoto)" 
            [alt]="project.title + ' cover'"
            class="w-full h-full object-cover rounded-lg"
            style="max-height: 320px;"
          >
        </div>
      </div>

      <!-- Description -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">About This Project</h2>
        <div class="prose prose-lg max-w-none">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{project.description}}</p>
        </div>
      </div>

      <!-- Links -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Project Links</h2>
        <div class="flex flex-wrap gap-4">
          <a 
            *ngIf="project.githubLink" 
            [href]="project.githubLink" 
            target="_blank"
            class="btn btn-dark d-inline-flex align-items-center gap-2"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>View on GitHub</span>
          </a>
          
          <a 
            *ngIf="project.liveLink" 
            [href]="project.liveLink" 
            target="_blank"
            class="btn btn-primary d-inline-flex align-items-center gap-2"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            <span>View Live Site</span>
          </a>
        </div>
      </div>

      <!-- Screenshots Carousel -->
      <div *ngIf="project.screenshots && project.screenshots.length > 0" class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Screenshots</h2>
        <div class="flex overflow-x-auto gap-4 pb-2">
          <div 
            *ngFor="let screenshot of project.screenshots; let i = index" 
            class="flex-shrink-0 cursor-pointer"
            style="width: 180px; height: 120px;"
            (click)="openImageModal(screenshot, i)"
          >
            <img 
              [src]="getImageUrl(screenshot)" 
              [alt]="'Screenshot ' + (i + 1)"
              class="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div 
        *ngIf="selectedImage" 
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        (click)="closeImageModal()"
      >
        <div class="max-w-4xl max-h-full p-4">
          <img 
            [src]="selectedImage" 
            [alt]="'Screenshot ' + (selectedImageIndex + 1)"
            class="max-w-full max-h-full object-contain"
          >
          <div class="text-center mt-4">
            <button 
              (click)="closeImageModal()"
              class="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Back to Projects -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <a routerLink="/projects" class="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to All Projects
        </a>
      </div>
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null
  loading = true
  currentUser: User | null = null
  isOwner = false
  selectedImage: string | null = null
  selectedImageIndex = 0

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
      this.checkOwnership()
    })

    this.route.params.subscribe((params) => {
      const projectId = params["id"]
      if (projectId) {
        this.loadProject(projectId)
      }
    })
  }

  loadProject(id: string): void {
    this.loading = true
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project
        this.loading = false
        this.checkOwnership()
      },
      error: (error) => {
        console.error("Error loading project:", error)
        this.loading = false
      },
    })
  }

  checkOwnership(): void {
    if (this.project && this.currentUser) {
      this.isOwner = this.project.author._id === this.currentUser._id
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  editProject(): void {
    if (this.project) {
      this.router.navigate(["/edit-project", this.project._id])
    }
  }

  deleteProject(): void {
    if (!this.project) return

    const confirmed = confirm("Are you sure you want to delete this project? This action cannot be undone.")

    if (confirmed) {
      this.projectService.deleteProject(this.project._id).subscribe({
        next: () => {
          alert("Project deleted successfully")
          this.router.navigate(["/projects"])
        },
        error: (error) => {
          console.error("Error deleting project:", error)
          alert("Error deleting project. Please try again.")
        },
      })
    }
  }

  openImageModal(image: string, index: number): void {
    this.selectedImage = image
    this.selectedImageIndex = index
  }

  closeImageModal(): void {
    this.selectedImage = null
    this.selectedImageIndex = 0
  }

  getImageUrl(path: string): string {
    if (!path) return '/placeholder.svg?height=100&width=100';
    return `http://localhost:3000/${path}`;
  }
}
