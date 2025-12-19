import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'c-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './c-sidebar.html',
  styleUrl: './c-sidebar.scss',
})
export class CSidebar {

  logo = 'Nibiru Home Logo Sin fondo .png';

  sideNavItems = [
    { name: 'Inicio', icon: 'pagina-de-inicio.png', route: '/admin' },
    { name: 'Productos', icon: 'cadena-de-suministro.png', route: '/admin/products' },
    { name: 'Usuarios', icon: 'avatar.png', route: '/admin/users' },
    { name: 'Pedidos', icon: 'entrega-de-pedidos.png', route: '/admin/orders' },
    { name: 'Categorías', icon: 'categorizacion.png', route: '/admin/categories' },
    
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

}
