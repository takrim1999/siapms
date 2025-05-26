import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-xl font-bold text-gray-900">SIAPMS</a>
            </div>
          </div>
          <div class="flex items-center">
            <ng-container *ngIf="(authService.currentUser$ | async) as user; else authLinks">
              <span class="text-gray-700 mr-4">Welcome, {{ user.username }}</span>
              <button
                (click)="logout()"
                class="text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </ng-container>
            <ng-template #authLinks>
              <a
                routerLink="/login"
                class="text-gray-700 hover:text-gray-900 mr-4"
              >
                Login
              </a>
              <a
                routerLink="/register"
                class="text-gray-700 hover:text-gray-900"
              >
                Register
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-8">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [],
  imports: [RouterOutlet, RouterLink, HttpClientModule, CommonModule],
  standalone: true
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
