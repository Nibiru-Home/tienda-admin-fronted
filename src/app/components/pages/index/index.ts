
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CSidebar} from '../../ui/c-sidebar/c-sidebar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CSidebar],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
