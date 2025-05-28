import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ProfileService } from "../../services/profile.service";
import { AuthService } from "../../services/auth.service";
import type { User } from "../../models/project.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">{{ isOwnProfile ? 'Your Profile' : user?.username + "'s Profile" }}</h1>
      
      <!-- View Mode -->
      <div *ngIf="user && !isOwnProfile" class="space-y-6">
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
      <form (ngSubmit)="onSubmit()" *ngIf="user && isOwnProfile">
        <div class="flex flex-col items-center mb-4">
          <img
            *ngIf="profilePicturePreview || user.profilePicture"
            [src]="profilePicturePreview || getImageUrl(user.profilePicture)"
            alt="Profile Picture"
            class="rounded-full w-24 h-24 object-cover mb-2 border"
          />
          <input type="file" (change)="onProfilePictureChange($event)" accept="image/*" />
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
        <button type="submit" class="btn btn-primary w-full" [disabled]="loading">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
      <div *ngIf="!user && !loading" class="text-center text-gray-500">Could not load profile.</div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  profilePictureFile: File | null = null;
  profilePicturePreview: string | null = null;
  isOwnProfile = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute
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
          },
          error: () => {
            this.loading = false;
          },
        });
      } else {
        // Viewing own profile
        this.isOwnProfile = true;
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
    if (!this.user) return;
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