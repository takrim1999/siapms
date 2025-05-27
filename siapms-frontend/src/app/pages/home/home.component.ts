import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span class="text-blue-600">SIAPMS</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
          Showcase your amazing projects to the world. Share your work, get discovered, and inspire others with your creativity.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a routerLink="/projects" class="btn-primary text-lg px-8 py-3">
            Browse Projects
          </a>
          <a routerLink="/register" class="btn-secondary text-lg px-8 py-3">
            Get Started
          </a>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mt-16">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" style="vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Create Projects</h3>
            <p class="text-gray-600">Easily upload your projects with images, descriptions, and links.</p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" style="vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Get Discovered</h3>
            <p class="text-gray-600">Make your projects public and let others discover your work.</p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" style="vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Inspire Others</h3>
            <p class="text-gray-600">Share your creative process and inspire the next generation of creators.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {}
