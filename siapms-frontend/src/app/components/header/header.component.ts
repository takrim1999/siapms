import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import type { User } from "../../models/project.model"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <a routerLink="/" class="text-2xl font-bold text-blue-600">SIAPMS</a>
            <div class="hidden md:flex space-x-6">
              <a routerLink="/projects" class="text-gray-600 hover:text-blue-600 transition-colors">Projects</a>
              <a *ngIf="currentUser" routerLink="/create-project" class="text-gray-600 hover:text-blue-600 transition-colors">Create Project</a>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div *ngIf="currentUser; else authButtons" class="flex items-center space-x-4">
              <span class="text-gray-700">Welcome, {{currentUser.username}}</span>
              <button (click)="logout()" class="btn-secondary">Logout</button>
            </div>
            
            <ng-template #authButtons>
              <a routerLink="/login" class="text-gray-600 hover:text-blue-600 transition-colors">Login</a>
              <a routerLink="/register" class="btn-primary">Register</a>
            </ng-template>
          </div>
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout(): void {
    this.authService.logout()
  }
}
