import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div>
        <h1 class="home-title">
          Welcome to <span class="home-title-highlight">SIAPMS</span>
        </h1>
        <p class="home-subtitle">
          Showcase your amazing projects to the world. Share your work, get discovered, and inspire others with your creativity.
        </p>
        <div class="home-actions">
          <a routerLink="/projects" class="btn-primary home-action-btn">
            Browse Projects
          </a>
          <a routerLink="/register" class="btn-secondary home-action-btn">
            Get Started
          </a>
        </div>
        <div class="home-grid">
          <div class="home-feature">
            <div class="home-feature-icon home-feature-icon-blue">
              <svg width="32" height="32" style="vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="home-feature-title">Create Projects</h3>
            <p class="home-feature-desc">Easily upload your projects with images, descriptions, and links.</p>
          </div>
          <div class="home-feature">
            <div class="home-feature-icon home-feature-icon-green">
              <svg width="32" height="32" style="vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 class="home-feature-title">Get Discovered</h3>
            <p class="home-feature-desc">Make your projects public and let others discover your work.</p>
          </div>
          <div class="home-feature">
            <div class="home-feature-icon home-feature-icon-purple">
              <svg width="32" height="32" style="vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="home-feature-title">Inspire Others</h3>
            <p class="home-feature-desc">Share your creative process and inspire the next generation of creators.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {}
