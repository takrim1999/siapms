import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../services/project.service';

@Component({
  selector: 'app-project-form',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        {{ isEditMode ? 'Edit Project' : 'Create New Project' }}
      </h1>

      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="max-w-2xl">
        <div class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Cover Photo -->
          <div>
            <label for="coverPhoto" class="block text-sm font-medium text-gray-700">Cover Photo</label>
            <input
              type="file"
              id="coverPhoto"
              (change)="onFileSelected($event, 'coverPhoto')"
              accept="image/*"
              class="mt-1 block w-full"
            >
            <img
              *ngIf="coverPhotoPreview"
              [src]="coverPhotoPreview"
              alt="Cover preview"
              class="mt-2 h-32 object-cover rounded"
            >
          </div>

          <!-- Screenshots -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Screenshots</label>
            <input
              type="file"
              multiple
              (change)="onFileSelected($event, 'screenshots')"
              accept="image/*"
              class="mt-1 block w-full"
            >
            <div class="mt-2 grid grid-cols-3 gap-4">
              <img
                *ngFor="let screenshot of screenshotPreviews"
                [src]="screenshot"
                alt="Screenshot preview"
                class="h-24 object-cover rounded"
              >
            </div>
          </div>

          <!-- GitHub Link -->
          <div>
            <label for="githubLink" class="block text-sm font-medium text-gray-700">GitHub Link</label>
            <input
              type="url"
              id="githubLink"
              formControlName="githubLink"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- Live Link -->
          <div>
            <label for="liveLink" class="block text-sm font-medium text-gray-700">Live Demo Link</label>
            <input
              type="url"
              id="liveLink"
              formControlName="liveLink"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- Public/Private -->
          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="isPublic"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
              <span class="ml-2 text-sm text-gray-700">Make this project public</span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              routerLink="/"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="projectForm.invalid || isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isEditMode ? 'Update Project' : 'Create Project' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  coverPhotoPreview: string | null = null;
  screenshotPreviews: string[] = [];
  private projectId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      githubLink: [''],
      liveLink: [''],
      isPublic: [true]
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditMode = true;
      this.loadProject();
    }
  }

  loadProject(): void {
    if (this.projectId) {
      this.projectService.getUserProjects().subscribe(
        projects => {
          const project = projects.find(p => p._id === this.projectId);
          if (project) {
            this.projectForm.patchValue({
              title: project.title,
              description: project.description,
              githubLink: project.githubLink,
              liveLink: project.liveLink,
              isPublic: project.isPublic
            });
            this.coverPhotoPreview = project.coverPhoto;
            this.screenshotPreviews = project.screenshots;
          }
        },
        error => console.error('Error loading project:', error)
      );
    }
  }

  onFileSelected(event: Event, type: 'coverPhoto' | 'screenshots'): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    if (type === 'coverPhoto') {
      const file = files[0];
      if (file) {
        this.projectForm.patchValue({ coverPhoto: file });
        this.createPreview(file).then(url => this.coverPhotoPreview = url);
      }
    } else {
      const fileArray = Array.from(files);
      this.projectForm.patchValue({ screenshots: fileArray });
      this.screenshotPreviews = [];
      fileArray.forEach(file => {
        this.createPreview(file).then(url => this.screenshotPreviews.push(url));
      });
    }
  }

  private createPreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    this.isSubmitting = true;
    const formData = new FormData();
    
    Object.keys(this.projectForm.value).forEach(key => {
      if (key === 'coverPhoto' || key === 'screenshots') return;
      formData.append(key, this.projectForm.value[key]);
    });

    if (this.projectForm.get('coverPhoto')?.value) {
      formData.append('coverPhoto', this.projectForm.get('coverPhoto')?.value);
    }

    const screenshots = this.projectForm.get('screenshots')?.value;
    if (screenshots) {
      screenshots.forEach((file: File) => {
        formData.append('screenshots', file);
      });
    }

    const request = this.isEditMode
      ? this.projectService.updateProject(this.projectId!, formData)
      : this.projectService.createProject(formData);

    request.subscribe(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        console.error('Error saving project:', error);
        this.isSubmitting = false;
      }
    );
  }
} 