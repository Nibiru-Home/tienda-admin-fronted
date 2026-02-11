
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { CDashboardStats } from '../../ui/c-dashboard-stats/c-dashboard-stats';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { CProductTableActions } from '../../ui/c-product-table-actions/c-product-table-actions';
import { OrderService } from '../../../services/order.service';

type LatestProductRow = {
  id: number;
  name: string;
  categoryName: string;
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
  private orderService = inject(OrderService);

  stats = [
    { label: 'Productos activos', value: '...' },
    { label: 'Pedidos esta semana', value: '...' },
    { label: 'Usuarios registrados', value: '...' },
  ];

  latestProducts: LatestProductRow[] = [];
  loadingLatestProducts = true;
  userName: string = 'Administrador';
  deleteCandidateId: number | null = null;
  isDeleting = false;

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

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.stats[1].value = this.countCurrentWeekOrders(orders).toString();
      },
      error: (err) => {
        console.error('Error loading weekly orders count', err);
        this.stats[1].value = '0';
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

  private countCurrentWeekOrders(orders: any[]): number {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = (day + 6) % 7;

    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - diffToMonday);

    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(weekStart.getDate() + 7);

    return (orders ?? []).reduce((count, order) => {
      const orderDate = this.parseOrderDate(order?.date);
      if (!orderDate) {
        return count;
      }
      return orderDate >= weekStart && orderDate < nextWeekStart ? count + 1 : count;
    }, 0);
  }

  private parseOrderDate(value: unknown): Date | null {
    if (value === null || value === undefined) {
      return null;
    }

    let parsed: Date;
    if (typeof value === 'number') {
      parsed = new Date(value);
    } else if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
      parsed = new Date(Number(value));
    } else {
      parsed = new Date(String(value));
    }

    return Number.isNaN(parsed.getTime()) ? null : parsed;
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
      image: image.length > 0 ? `images/products/${image}` : undefined,
    };
  }

  goToAddProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(productId: number) {
    this.router.navigate(['/admin/products', productId]);
  }

  deleteProduct(productId: number) {
    this.deleteCandidateId = productId;
  }

  cancelDelete() {
    if (this.isDeleting) return;
    this.deleteCandidateId = null;
  }

  confirmDelete() {
    if (this.deleteCandidateId === null || this.isDeleting) {
      return;
    }
    this.isDeleting = true;

    this.productService.deleteProduct(this.deleteCandidateId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.deleteCandidateId = null;
        this.loadLatestProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.isDeleting = false;
        this.deleteCandidateId = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
