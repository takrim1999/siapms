import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProfileService } from "../../services/profile.service";
import { AuthService } from "../../services/auth.service";
import type { User } from "../../models/project.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading profile...</p>
      </div>

      <div *ngIf="!loading && !user" class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
        <p class="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
        <a routerLink="/projects" class="btn-primary">Back to Projects</a>
      </div>

      <div *ngIf="user && !loading" class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">{{ isOwnProfile ? 'Your Profile' : user.username + "'s Profile" }}</h1>
          <button *ngIf="isOwnProfile" (click)="toggleEditMode()" class="btn-secondary">
            {{ isEditMode ? 'Cancel Edit' : 'Edit Profile' }}
          </button>
        </div>

        <!-- View Mode -->
        <div *ngIf="!isEditMode" class="space-y-6">
          <div class="flex flex-col items-center mb-4">
            <img
              *ngIf="user.profilePicture"
              [src]="getImageUrl(user.profilePicture)"
              alt="Profile Picture"
              class="rounded-full w-24 h-24 object-cover mb-2 border"
            />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Username</label>
            <input class="form-input w-full" [value]="user.username" disabled />
          </div>
          <div class="mb-3" *ngIf="user.bio">
            <label class="block text-sm font-medium mb-1">Bio</label>
            <p class="text-gray-700">{{ user.bio }}</p>
          </div>
          <div class="mb-3" *ngIf="user.website">
            <label class="block text-sm font-medium mb-1">Website</label>
            <a [href]="user.website" target="_blank" class="text-blue-600 hover:underline">{{ user.website }}</a>
          </div>
          <div class="flex gap-4">
            <a *ngIf="user.twitter" [href]="user.twitter" target="_blank" class="text-blue-400 hover:text-blue-600">
              <i class="bi bi-twitter"></i> Twitter
            </a>
            <a *ngIf="user.linkedin" [href]="user.linkedin" target="_blank" class="text-blue-700 hover:text-blue-900">
              <i class="bi bi-linkedin"></i> LinkedIn
            </a>
            <a *ngIf="user.github" [href]="user.github" target="_blank" class="text-gray-900 hover:text-gray-700">
              <i class="bi bi-github"></i> GitHub
            </a>
          </div>
        </div>

        <!-- Edit Mode -->
        <form (ngSubmit)="onSubmit()" *ngIf="isEditMode" class="space-y-6">
          <div class="flex flex-col items-center mb-4">
            <img
              *ngIf="profilePicturePreview || user.profilePicture"
              [src]="profilePicturePreview || getImageUrl(user.profilePicture)"
              alt="Profile Picture"
              class="rounded-full w-24 h-24 object-cover mb-2 border"
            />
            <input type="file" (change)="onProfilePictureChange($event)" accept="image/*" class="mt-2" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Email</label>
            <input class="form-input w-full" [value]="user.email" disabled />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Username</label>
            <input class="form-input w-full" [(ngModel)]="user.username" name="username" required />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Bio</label>
            <textarea class="form-input w-full" [(ngModel)]="user.bio" name="bio" rows="3"></textarea>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Website</label>
            <input class="form-input w-full" [(ngModel)]="user.website" name="website" type="url" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">Twitter</label>
            <input class="form-input w-full" [(ngModel)]="user.twitter" name="twitter" type="url" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">LinkedIn</label>
            <input class="form-input w-full" [(ngModel)]="user.linkedin" name="linkedin" type="url" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1">GitHub</label>
            <input class="form-input w-full" [(ngModel)]="user.github" name="github" type="url" />
          </div>
          <button type="submit" class="btn-primary w-full" [disabled]="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  profilePictureFile: File | null = null;
  profilePicturePreview: string | null = null;
  isOwnProfile = false;
  isEditMode = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        // Viewing another user's profile
        this.profileService.getUserProfile(username).subscribe({
          next: (user) => {
            this.user = user;
            this.loading = false;
            this.checkOwnership();
          },
          error: () => {
            this.loading = false;
          },
        });
      } else {
        // Viewing own profile
        this.profileService.getProfile().subscribe({
          next: (user) => {
            this.user = user;
            this.loading = false;
            this.checkOwnership();
          },
          error: () => {
            this.loading = false;
          },
        });
      }
    });
  }

  checkOwnership(): void {
    this.authService.currentUser$.subscribe(currentUser => {
      if (currentUser && this.user) {
        this.isOwnProfile = currentUser._id === this.user._id;
      }
    });
  }

  toggleEditMode(): void {
    if (this.isOwnProfile) {
      this.isEditMode = !this.isEditMode;
      if (!this.isEditMode) {
        // Reset any unsaved changes
        this.profilePicturePreview = null;
        this.profilePictureFile = null;
        this.loadProfile(); // Reload the profile to reset any changes
      }
    }
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onProfilePictureChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profilePictureFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicturePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return '/placeholder.svg?height=100&width=100';
    return `http://localhost:3000/${path}`;
  }

  onSubmit(): void {
    if (!this.user || !this.isOwnProfile) return;
    this.loading = true;
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('bio', this.user.bio || '');
    formData.append('website', this.user.website || '');
    formData.append('twitter', this.user.twitter || '');
    formData.append('linkedin', this.user.linkedin || '');
    formData.append('github', this.user.github || '');
    if (this.profilePictureFile) {
      formData.append('profilePicture', this.profilePictureFile);
    }
    this.profileService.updateProfile(formData).subscribe({
      next: (user) => {
        this.user = user;
        this.profilePicturePreview = null;
        this.profilePictureFile = null;
        this.isEditMode = false;
        this.loading = false;
        alert('Profile updated successfully!');
      },
      error: () => {
        this.loading = false;
        alert('Error updating profile.');
      },
    });
  }
} 