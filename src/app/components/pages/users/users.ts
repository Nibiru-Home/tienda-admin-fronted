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
        const normalized = (users as unknown as any[])
          .map((user) => this.normalizeUser(user))
          .filter((user) => user.id > 0);

        this.users = normalized.sort((a, b) => a.id - b.id);
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
      id: Number(user?.id ?? 0),
      username: String(user?.username ?? ''),
      email: String(user?.email ?? ''),
      name: String(user?.name ?? ''),
      surname: String(user?.surname ?? ''),
      role: user?.role ? String(user.role) : undefined,
    };
  }
}
