import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "./components/header/header.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <app-header></app-header>
      <main class="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  title = "SIAPMS - Project Showcase"
}
