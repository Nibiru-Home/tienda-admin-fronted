
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { CDashboardStats } from '../../ui/c-dashboard-stats/c-dashboard-stats';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { CProductTableActions } from '../../ui/c-product-table-actions/c-product-table-actions';

type LatestProductRow = {
  id: number;
  name: string;
  categoryName: string;
  stock: number;
  image?: string;
};

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CSidebar, CDashboardStats, CProductTableActions],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  private productService = inject(ProductService);

  stats = [
    { label: 'Productos activos', value: '...' },
    { label: 'Pedidos esta semana', value: '...' },
    { label: 'Usuarios registrados', value: '...' },
  ];

  latestProducts: LatestProductRow[] = [];
  loadingLatestProducts = true;
  userName: string = 'Administrador';

  ngOnInit() {
    const storedName = this.authService.getUserName();
    if (storedName) {
      this.userName = storedName;
    }
    this.loadLatestProducts();
    this.loadStats();
  }

  loadStats() {
    this.productService.getProductsCount().subscribe({
      next: (count) => {
        this.stats[0].value = count.toString();
      },
      error: (err) => {
        console.error('Error loading products count', err);
        this.stats[0].value = '0';
      }
    });

    this.authService.getUsersCount().subscribe({
      next: (count) => {
        this.stats[2].value = count.toString();
      },
      error: (err) => {
        console.error('Error loading users count', err);
        this.stats[2].value = '0';
      }
    });
  }

  loadLatestProducts() {
    this.loadingLatestProducts = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        const normalized = (products as unknown as any[])
          .map((product) => this.normalizeProduct(product))
          .filter((product) => product.id > 0 && product.name.length > 0);

        this.latestProducts = normalized.sort((a, b) => b.id - a.id).slice(0, 4);
        this.loadingLatestProducts = false;
      },
    });
  }

  private normalizeProduct(product: any): LatestProductRow {
    const category = product?.category;
    const categoryName = Array.isArray(category)
      ? (category[0]?.name ?? '')
      : (category?.name ?? category ?? '');

    const image = typeof product?.image === 'string' ? product.image.trim() : '';

    return {
      id: Number(product?.id ?? 0),
      name: String(product?.name ?? ''),
      categoryName: String(categoryName ?? ''),
      stock: Number(product?.stock ?? 0),
      image: image.length > 0 ? `images/products/${image}` : undefined,
    };
  }

  goToProducts() {
    this.router.navigate(['/admin/products']);
  }

  viewProduct(productId: number) {
    this.router.navigate(['/admin/products'], { queryParams: { id: productId } });
  }

  deleteProduct(productId: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.loadLatestProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
