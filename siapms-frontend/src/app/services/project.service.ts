import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Project {
  _id: string;
  title: string;
  description: string;
  coverPhoto: string;
  screenshots: string[];
  githubLink?: string;
  liveLink?: string;
  isPublic: boolean;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPublicProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`);
  }

  getUserProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects/my-projects`, {
      headers: this.getHeaders()
    });
  }

  createProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/projects`, formData, {
      headers: this.getHeaders()
    });
  }

  updateProject(id: string, formData: FormData): Observable<Project> {
    return this.http.put<Project>(`${environment.apiUrl}/projects/${id}`, formData, {
      headers: this.getHeaders()
    });
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/projects/${id}`, {
      headers: this.getHeaders()
    });
  }
} 