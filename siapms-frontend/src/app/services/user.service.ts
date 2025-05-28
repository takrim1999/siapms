import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://siapms-back.onrender.com/api';

  constructor(private http: HttpClient) {}

  // ... rest of the service code ...
} 