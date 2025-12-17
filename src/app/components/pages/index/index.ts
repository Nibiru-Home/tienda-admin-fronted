
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CSidebar],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  authService = inject(AuthService);
  router = inject(Router);

  stats = [
    { label: 'Productos activos', value: '240'},
    { label: 'Pedidos esta semana', value: '56'},
    { label: 'Usuarios registrados', value: '1.204'},
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
