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
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary" routerLink="/">SIAPMS</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/projects">Projects</a>
            </li>
            <li class="nav-item" *ngIf="currentUser">
              <a class="nav-link" routerLink="/create-project">Create Project</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <ng-container *ngIf="currentUser; else authButtons">
              <li class="nav-item d-flex align-items-center">
                <a class="nav-link fw-bold text-primary" routerLink="/profile" style="cursor:pointer;">Welcome, {{currentUser.username}}</a>
              </li>
              <li class="nav-item">
                <button (click)="logout()" class="btn btn-outline-secondary ms-2">Logout</button>
              </li>
            </ng-container>
            <ng-template #authButtons>
              <li class="nav-item">
                <a class="nav-link" routerLink="/login">Login</a>
              </li>
              <li class="nav-item">
                <a class="btn btn-primary ms-2" routerLink="/register">Register</a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
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
