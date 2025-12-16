import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model'
import { HTTPService } from './http.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authRoute: string = '/api/auth'

  constructor(private httpService: HTTPService) { }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>(`${this.authRoute}/register`, request)
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>(`${this.authRoute}/login`, request)
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  logout(): void {
    localStorage.removeItem('auth_token')
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null
  }
}
