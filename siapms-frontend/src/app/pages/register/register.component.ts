import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">Join SIAPMS</h1>
        
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username"
              class="form-input" 
              required
              placeholder="Choose a username"
            >
          </div>

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
              placeholder="Create a password"
            >
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              class="form-input" 
              required
              placeholder="Confirm your password"
            >
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full btn-primary disabled:opacity-50"
          >
            {{loading ? 'Creating Account...' : 'Create Account'}}
          </button>
        </form>

        <p class="text-center text-sm text-gray-600 mt-4">
          Already have an account? 
          <a routerLink="/login" class="text-blue-600 hover:text-blue-800">Login here</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  username = ""
  email = ""
  password = ""
  confirmPassword = ""
  loading = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    this.loading = true
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.loading = false
        alert("Account created successfully! Please login.")
        this.router.navigate(["/login"])
      },
      error: (error) => {
        this.loading = false
        console.error("Registration error:", error)
        alert("Error creating account. Please try again.")
      },
    })
  }
}
