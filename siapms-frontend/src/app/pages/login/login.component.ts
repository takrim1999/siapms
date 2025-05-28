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
    <div class="container min-vh-100 d-flex justify-content-center align-items-center">
      <div class="card shadow" style="width: 100%; max-width: 400px;">
        <div class="card-body">
          <h1 class="card-title text-center mb-4">Login to SIAPMS</h1>
          <form (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" class="form-control" required placeholder="Enter your email">
          </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" class="form-control" required placeholder="Enter your password">
          </div>
            <button type="submit" [disabled]="loading" class="btn btn-primary w-100">
            {{loading ? 'Logging in...' : 'Login'}}
          </button>
        </form>
          <p class="text-center text-muted mt-3">
          Don't have an account? 
            <a routerLink="/register">Register here</a>
        </p>
        </div>
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
