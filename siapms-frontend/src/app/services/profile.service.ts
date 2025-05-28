import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import type { User } from "../models/project.model";

@Injectable({ providedIn: "root" })
export class ProfileService {
  private apiUrl = "http://localhost:3000/api/users";

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getHeaders() });
  }

  updateProfile(profileData: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, profileData, { headers: this.getHeaders() });
  }
} 