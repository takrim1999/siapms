import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ProjectService } from "../../services/project.service";
import type { Project, CreateProjectRequest } from "../../models/project.model";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MarkdownEditorComponent } from "../../components/markdown-editor/markdown-editor.component";

@Component({
  selector: "app-edit-project",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MarkdownEditorComponent],
  template: `
    <div class="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading project...</p>
      </div>

      <div *ngIf="!loading && !project" class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
        <p class="text-gray-600 mb-6">The project you're trying to edit doesn't exist or has been removed.</p>
        <a routerLink="/projects" class="btn-primary">Back to Projects</a>
      </div>

      <form *ngIf="project && !loading" (ngSubmit)="onSubmit()" class="space-y-6">
        <h1 class="text-2xl font-bold mb-6">Edit Project</h1>

        <!-- Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            [(ngModel)]="project.title"
            name="title"
            class="form-input w-full"
            required
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="form-label">Description</label>
          <app-markdown-editor
            [value]="project.description"
            (valueChange)="onDescriptionChange($event)"
          ></app-markdown-editor>
          <div *ngIf="projectForm.get('description')?.errors?.['required'] && projectForm.get('description')?.touched" 
               class="text-red-500 text-sm mt-1">
            Description is required
          </div>
        </div>

        <!-- Cover Photo -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Cover Photo</label>
          <div class="flex items-center gap-4">
            <img
              *ngIf="coverPhotoPreview || project.coverPhoto"
              [src]="coverPhotoPreview || getImageUrl(project.coverPhoto)"
              alt="Cover Preview"
              class="w-32 h-32 object-cover rounded-lg"
            />
            <input
              type="file"
              (change)="onCoverPhotoChange($event)"
              accept="image/*"
              class="form-input"
            />
          </div>
        </div>

        <!-- Screenshots -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Screenshots</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div
              *ngFor="let screenshot of project.screenshots; let i = index"
              class="relative group"
            >
              <img
                [src]="getImageUrl(screenshot)"
                [alt]="'Screenshot ' + (i + 1)"
                class="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                (click)="removeScreenshot(i)"
                class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
          <input
            type="file"
            (change)="onScreenshotsChange($event)"
            accept="image/*"
            multiple
            class="form-input"
          />
        </div>

        <!-- Links -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">GitHub Link</label>
            <input
              type="url"
              [(ngModel)]="project.githubLink"
              name="githubLink"
              class="form-input w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Live Demo Link</label>
            <input
              type="url"
              [(ngModel)]="project.liveLink"
              name="liveLink"
              class="form-input w-full"
            />
          </div>
        </div>

        <!-- Visibility -->
        <div class="mb-6">
          <label class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="project.isPublic"
              name="isPublic"
              class="form-checkbox"
            />
            <span class="ml-2">Make this project public</span>
          </label>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            (click)="cancel()"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn-primary"
            [disabled]="loading"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EditProjectComponent implements OnInit {
  project: Project | null = null;
  loading = false;
  coverPhotoFile: File | null = null;
  coverPhotoPreview: string | null = null;
  newScreenshots: File[] = [];
  projectForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private formBuilder: FormBuilder
  ) {
    this.projectForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      if (projectId) {
        this.loadProject(projectId);
      }
    });
  }

  loadProject(id: string): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.project = project;
        this.projectForm.patchValue({
          description: project.description
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onCoverPhotoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.coverPhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPhotoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onScreenshotsChange(event: any): void {
    const files = event.target.files;
    if (files) {
      this.newScreenshots = Array.from(files);
    }
  }

  removeScreenshot(index: number): void {
    if (this.project) {
      this.project.screenshots.splice(index, 1);
    }
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return '/placeholder.svg?height=100&width=100';
    return `http://localhost:3000/${path}`;
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }

  onSubmit(): void {
    if (!this.project) return;
    this.loading = true;

    const projectData: Partial<CreateProjectRequest> = {
      title: this.project.title,
      description: this.project.description,
      githubLink: this.project.githubLink || '',
      liveLink: this.project.liveLink || '',
      isPublic: this.project.isPublic,
      coverPhoto: this.coverPhotoFile,
      screenshots: this.newScreenshots,
    };

    this.projectService.updateProject(this.project._id, projectData).subscribe({
      next: () => {
        this.loading = false;
        alert('Project updated successfully!');
        this.router.navigate(['/projects', this.project?._id]);
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.loading = false;
        alert('Error updating project. Please try again.');
      },
    });
  }

  onDescriptionChange(value: string): void {
    if (this.project) {
      this.project.description = value;
      this.projectForm.get('description')?.setValue(value);
    }
  }
} 