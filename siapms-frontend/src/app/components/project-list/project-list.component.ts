import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService, Project } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-list',
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          *ngIf="isAuthenticated"
          routerLink="/projects/new"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Project
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let project of projects" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <img [src]="project.coverPhoto" [alt]="project.title" class="w-full h-48 object-cover">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-2">{{ project.title }}</h2>
            <p class="text-gray-600 mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <a
                *ngIf="project.githubLink"
                [href]="project.githubLink"
                target="_blank"
                class="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
              >
                GitHub
              </a>
              <a
                *ngIf="project.liveLink"
                [href]="project.liveLink"
                target="_blank"
                class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
              >
                Live Demo
              </a>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">By {{ project.author.username }}</span>
              <button
                *ngIf="isAuthenticated && project.author._id === currentUserId"
                [routerLink]="['/projects', project._id, 'edit']"
                class="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  isAuthenticated = false;
  currentUserId: string | null = null;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUserId = user?.id || null;
    });
  }

  loadProjects(): void {
    this.projectService.getPublicProjects().subscribe(
      projects => this.projects = projects,
      error => console.error('Error loading projects:', error)
    );
  }
} 