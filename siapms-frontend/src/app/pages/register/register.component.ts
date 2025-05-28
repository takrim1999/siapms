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
    <div class="container min-vh-100 d-flex justify-content-center align-items-center">
      <div class="card shadow" style="width: 100%; max-width: 400px;">
        <div class="card-body">
          <h1 class="card-title text-center mb-4">Join SIAPMS</h1>
          <form (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" id="username" [(ngModel)]="username" name="username" class="form-control" required placeholder="Choose a username">
          </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" class="form-control" required placeholder="Enter your email">
          </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" class="form-control" required placeholder="Create a password">
          </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" class="form-control" required placeholder="Confirm your password">
          </div>
            <button type="submit" [disabled]="loading" class="btn btn-primary w-100">
            {{loading ? 'Creating Account...' : 'Create Account'}}
          </button>
        </form>
          <p class="text-center text-muted mt-3">
          Already have an account? 
            <a routerLink="/login">Login here</a>
        </p>
        </div>
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
