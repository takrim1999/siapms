import { Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/home.component"
import { ProjectsComponent } from "./pages/projects/projects.component"
import { ProjectDetailComponent } from "./pages/project-detail/project-detail.component"
import { CreateProjectComponent } from "./pages/create-project/create-project.component"
import { LoginComponent } from "./pages/login/login.component"
import { RegisterComponent } from "./pages/register/register.component"
import { AuthGuard } from "./guards/auth.guard"
import { ProfileComponent } from "./pages/profile/profile.component"
import { EditProjectComponent } from "./pages/edit-project/edit-project.component"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "projects",
    pathMatch: "full",
  },
  {
    path: "projects",
    loadComponent: () =>
      import("./pages/projects/projects.component").then((m) => m.ProjectsComponent),
  },
  {
    path: "projects/:id",
    loadComponent: () =>
      import("./pages/project-detail/project-detail.component").then(
        (m) => m.ProjectDetailComponent,
      ),
  },
  {
    path: "edit-project/:id",
    loadComponent: () =>
      import("./pages/edit-project/edit-project.component").then(
        (m) => m.EditProjectComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "create-project",
    loadComponent: () =>
      import("./pages/create-project/create-project.component").then(
        (m) => m.CreateProjectComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./pages/profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "profile/:username",
    loadComponent: () =>
      import("./pages/profile/profile.component").then((m) => m.ProfileComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/register/register.component").then((m) => m.RegisterComponent),
  },
  { path: "**", redirectTo: "" },
]
