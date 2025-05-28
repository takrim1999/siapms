import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProfileService } from "../../services/profile.service";
import type { User } from "../../models/project.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 class="text-2xl font-bold mb-4">Your Profile</h1>
      <form (ngSubmit)="onSubmit()" *ngIf="user">
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

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
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