import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, CSidebar],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private authService = inject(AuthService);

  users: User[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getUsers().subscribe({
      next: (users) => {
        console.log('Raw users response:', users);
        const normalized = (users as unknown as any[])
          .map((user) => this.normalizeUser(user));
        console.log('Normalized users:', normalized);

        this.users = normalized;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.errorMessage = 'No se pudieron cargar los usuarios.';
        this.isLoading = false;
      },
    });
  }

  private normalizeUser(user: any): User {
    return {
      id: String(user?.id ?? ''),
      email: String(user?.email ?? ''),
      name: String(user?.name ?? ''),
      address: String(user?.address ?? ''),
      phone: String(user?.phone ?? ''),
      role: user?.role ? String(user.role) : undefined,
    };
  }
}
