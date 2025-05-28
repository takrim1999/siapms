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
          <button *ngIf="isOwnProfile" (click)="toggleEditMode()" class="btn btn-primary">
            {{ isEditMode ? 'Cancel Edit' : 'Edit Profile' }}
          </button>
        </div>

        <!-- View Mode -->
        <div *ngIf="!isEditMode" class="flex gap-8">
          <!-- Left Side - Profile Picture -->
          <div class="flex-shrink-0">
            <div class="relative w-48 h-48">
              <img
                *ngIf="user.profilePicture"
                [src]="getImageUrl(user.profilePicture)"
                alt="Profile Picture"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
              />
              <div *ngIf="!user.profilePicture" class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-6xl text-gray-400">{{user.username.charAt(0).toUpperCase()}}</span>
              </div>
            </div>
          </div>

          <!-- Right Side - Information -->
          <div class="flex-grow">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{user.username}}</h2>
            
            <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div *ngIf="user.bio" class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                <p class="text-gray-700 leading-relaxed">{{ user.bio }}</p>
              </div>

              <div *ngIf="user.website" class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Website</h3>
                <a [href]="user.website" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline">
                  {{ user.website }}
                </a>
              </div>

              <div class="flex gap-4">
                <a *ngIf="user.twitter" [href]="user.twitter" target="_blank" 
                  class="inline-flex items-center gap-2 text-blue-400 hover:text-blue-600">
                  <i class="bi bi-twitter"></i> Twitter
                </a>
                <a *ngIf="user.linkedin" [href]="user.linkedin" target="_blank" 
                  class="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900">
                  <i class="bi bi-linkedin"></i> LinkedIn
                </a>
                <a *ngIf="user.github" [href]="user.github" target="_blank" 
                  class="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700">
                  <i class="bi bi-github"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <form (ngSubmit)="onSubmit()" *ngIf="isEditMode" class="flex gap-8">
          <!-- Left Side - Profile Picture -->
          <div class="flex-shrink-0">
            <div class="relative w-48 h-48">
              <img
                *ngIf="profilePicturePreview || user.profilePicture"
                [src]="profilePicturePreview || getImageUrl(user.profilePicture)"
                alt="Profile Picture"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
              />
              <div *ngIf="!profilePicturePreview && !user.profilePicture" class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-6xl text-gray-400">{{user.username.charAt(0).toUpperCase()}}</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-2 mt-4">
              <label class="btn btn-outline-primary">
                Change Photo
                <input type="file" (change)="onProfilePictureChange($event)" accept="image/*" class="hidden" />
              </label>
              <span class="text-sm text-gray-500">Recommended: Square image, max 2MB</span>
            </div>
          </div>

          <!-- Right Side - Form -->
          <div class="flex-grow">
            <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input class="form-control" [value]="user.email" disabled />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input class="form-control" [(ngModel)]="user.username" name="username" required />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea class="form-control" [(ngModel)]="user.bio" name="bio" rows="3" 
                  placeholder="Tell us about yourself..."></textarea>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input class="form-control" [(ngModel)]="user.website" name="website" type="url" 
                  placeholder="https://your-website.com" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                <input class="form-control" [(ngModel)]="user.twitter" name="twitter" type="url" 
                  placeholder="https://twitter.com/username" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input class="form-control" [(ngModel)]="user.linkedin" name="linkedin" type="url" 
                  placeholder="https://linkedin.com/in/username" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input class="form-control" [(ngModel)]="user.github" name="github" type="url" 
                  placeholder="https://github.com/username" />
              </div>
              <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
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