import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">Login to SIAPMS</h1>
        
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email"
              class="form-input" 
              required
              placeholder="Enter your email"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password"
              class="form-input" 
              required
              placeholder="Enter your password"
            >
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{loading ? 'Logging in...' : 'Login'}}
          </button>
        </form>

        <p class="text-center text-sm text-gray-600 mt-4">
          Don't have an account? 
          <a routerLink="/register" class="text-blue-600 hover:text-blue-800">Register here</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = ""
  password = ""
  loading = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      alert("Please fill in all fields")
      return
    }

    this.loading = true
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(["/projects"])
      },
      error: (error) => {
        this.loading = false
        console.error("Login error:", error)
        alert("Invalid email or password")
      },
    })
  }
}
