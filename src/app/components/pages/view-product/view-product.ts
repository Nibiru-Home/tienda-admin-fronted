import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { CFormCard } from '../../ui/c-form-card/c-form-card';

type ProductDetails = {
  id: number;
  name: string;
  description: string;
  price: number | null;
  stock: number | null;
  image: string | null;
  categoryId: number | null;
  categoryName: string | null;
  styles: string[];
};

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, CSidebar, CFormCard],
  templateUrl: './view-product.html',
  styleUrl: './view-product.scss',
})
export class ViewProduct implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  isLoading = true;
  isDeleting = false;
  errorMessage = '';

  product: ProductDetails | null = null;

  private readonly imagesBaseUrl = 'http://localhost:4200/images/products/';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.errorMessage = 'Producto inválido.';
      this.isLoading = false;
      return;
    }

    this.loadProduct(id);
  }

  private loadProduct(id: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = this.normalizeProduct(product);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.errorMessage = 'No se pudo cargar el producto.';
        this.isLoading = false;
      },
    });
  }

  private normalizeProduct(raw: any): ProductDetails {
    const category = this.normalizeCategory(raw?.category);
    const styles = this.normalizeStyles(raw?.styles);

    return {
      id: this.toNumber(raw?.id) ?? 0,
      name: String(raw?.name ?? ''),
      description: String(raw?.description ?? ''),
      price: this.toNumber(raw?.price),
      stock: this.toNumber(raw?.stock),
      image: this.toStringOrNull(raw?.image),
      categoryId: category.id,
      categoryName: category.name,
      styles,
    };
  }

  private normalizeCategory(category: any): { id: number | null; name: string | null } {
    const normalized = Array.isArray(category) ? category[0] : category;

    if (typeof normalized === 'string') {
      const value = normalized.trim();
      return { id: null, name: value.length > 0 ? value : null };
    }

    if (normalized && typeof normalized === 'object') {
      const id = this.toNumber(normalized?.id);
      const name = this.toStringOrNull(normalized?.name);
      return { id, name };
    }

    return { id: null, name: null };
  }

  private normalizeStyles(styles: any): string[] {
    if (Array.isArray(styles)) {
      return styles.map((style) => String(style ?? '').trim()).filter((style) => style.length > 0);
    }

    if (typeof styles === 'string') {
      const value = styles.trim();
      return value.length > 0 ? [value] : [];
    }

    return [];
  }

  private toNumber(value: unknown): number | null {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  private toStringOrNull(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  get imageUrl(): string {
    const image = this.product?.image;
    if (!image) {
      return 'images/error-404.svg';
    }

    if (image.startsWith('http') || image.startsWith('/')) {
      return image;
    }

    return `${this.imagesBaseUrl}${image}`;
  }

  get categoryLabel(): string {
    if (!this.product) {
      return '-';
    }

    const { categoryId, categoryName } = this.product;

    if (categoryName && categoryId) {
      return `${categoryName} (#${categoryId})`;
    }

    if (categoryName) {
      return categoryName;
    }

    if (categoryId) {
      return `#${categoryId}`;
    }

    return '-';
  }

  get stylesLabel(): string {
    const styles = this.product?.styles ?? [];
    return styles.length > 0 ? styles.join(', ') : '-';
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }

  goToEdit() {
    const id = this.product?.id;
    if (!id) {
      return;
    }

    this.router.navigate(['/admin/products', id, 'edit']);
  }

  deleteProduct() {
    const id = this.product?.id;
    if (!id || this.isDeleting) {
      return;
    }

    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.isDeleting = false;
        this.errorMessage = 'No se pudo eliminar el producto.';
      },
    });
  }
}

