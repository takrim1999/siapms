import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { ProjectService } from "../../services/project.service"
import type { CreateProjectRequest } from "../../models/project.model"
import { MarkdownEditorComponent } from "../../components/markdown-editor/markdown-editor.component"

@Component({
  selector: "app-create-project",
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownEditorComponent],
  template: `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>
      
      <form (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
          <input 
            type="text" 
            id="title" 
            [(ngModel)]="projectData.title" 
            name="title"
            class="form-input" 
            required
            placeholder="Enter project title"
          >
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <app-markdown-editor
            [value]="projectData.description"
            (valueChange)="onDescriptionChange($event)"
          ></app-markdown-editor>
        </div>

        <div>
          <label for="coverPhoto" class="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
          <input 
            type="file" 
            id="coverPhoto" 
            (change)="onCoverPhotoChange($event)"
            accept="image/*"
            class="form-input"
          >
          <div *ngIf="coverPhotoPreview" class="mt-2">
            <img [src]="coverPhotoPreview" alt="Cover preview" class="w-32 h-32 object-cover rounded">
          </div>
        </div>

        <div>
          <label for="screenshots" class="block text-sm font-medium text-gray-700 mb-2">Screenshots</label>
          <input 
            type="file" 
            id="screenshots" 
            (change)="onScreenshotsChange($event)"
            accept="image/*"
            multiple
            class="form-input"
          >
          <div *ngIf="screenshotPreviews.length > 0" class="mt-2 grid grid-cols-4 gap-2">
            <img 
              *ngFor="let preview of screenshotPreviews" 
              [src]="preview" 
              alt="Screenshot preview" 
              class="w-20 h-20 object-cover rounded"
            >
          </div>
        </div>

        <div>
          <label for="githubLink" class="block text-sm font-medium text-gray-700 mb-2">GitHub Link</label>
          <input 
            type="url" 
            id="githubLink" 
            [(ngModel)]="projectData.githubLink" 
            name="githubLink"
            class="form-input"
            placeholder="https://github.com/username/repo"
          >
        </div>

        <div>
          <label for="liveLink" class="block text-sm font-medium text-gray-700 mb-2">Live Site Link</label>
          <input 
            type="url" 
            id="liveLink" 
            [(ngModel)]="projectData.liveLink" 
            name="liveLink"
            class="form-input"
            placeholder="https://yourproject.com"
          >
        </div>

        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="isPublic" 
            [(ngModel)]="projectData.isPublic" 
            name="isPublic"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="isPublic" class="ml-2 block text-sm text-gray-700">
            Make this project public
          </label>
        </div>

        <div class="flex space-x-4">
          <button 
            type="submit" 
            [disabled]="loading"
            class="btn-primary disabled:opacity-50"
          >
            {{loading ? 'Creating...' : 'Create Project'}}
          </button>
          <button 
            type="button" 
            (click)="goBack()"
            class="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CreateProjectComponent {
  projectData: CreateProjectRequest = {
    title: "",
    description: "",
    coverPhoto: null,
    screenshots: [],
    githubLink: "",
    liveLink: "",
    isPublic: true,
  }

  coverPhotoPreview: string | null = null
  screenshotPreviews: string[] = []
  loading = false

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {}

  onDescriptionChange(value: string): void {
    this.projectData.description = value;
  }

  onCoverPhotoChange(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.projectData.coverPhoto = file
      const reader = new FileReader()
      reader.onload = (e) => {
        this.coverPhotoPreview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  onScreenshotsChange(event: any): void {
    const files = Array.from(event.target.files) as File[]
    this.projectData.screenshots = files

    this.screenshotPreviews = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.screenshotPreviews.push(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  onSubmit(): void {
    if (!this.projectData.title || !this.projectData.description) {
      alert("Please fill in all required fields")
      return
    }

    this.loading = true
    this.projectService.createProject(this.projectData).subscribe({
      next: (project) => {
        this.loading = false
        this.router.navigate(["/projects", project._id])
      },
      error: (error) => {
        this.loading = false
        console.error("Error creating project:", error)
        alert("Error creating project. Please try again.")
      },
    })
  }

  goBack(): void {
    this.router.navigate(["/projects"])
  }
}
