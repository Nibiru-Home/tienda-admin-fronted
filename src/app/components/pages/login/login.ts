import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';

  login(event: Event) {
    event.preventDefault();

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.saveToken(response.token);
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.error('Login error', error);
        this.errorMessage = 'Credenciales inválidas o error de conexión';
      }
    });
  }
}
