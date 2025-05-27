import type { Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/home.component"
import { ProjectsComponent } from "./pages/projects/projects.component"
import { ProjectDetailComponent } from "./pages/project-detail/project-detail.component"
import { CreateProjectComponent } from "./pages/create-project/create-project.component"
import { LoginComponent } from "./pages/login/login.component"
import { RegisterComponent } from "./pages/register/register.component"
import { AuthGuard } from "./guards/auth.guard"

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "projects/:id", component: ProjectDetailComponent },
  { path: "create-project", component: CreateProjectComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "**", redirectTo: "" },
]
