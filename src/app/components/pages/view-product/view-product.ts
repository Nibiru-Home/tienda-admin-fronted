import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { CFormCard } from '../../ui/c-form-card/c-form-card';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, FormsModule, CSidebar, CFormCard],
  templateUrl: './view-product.html',
  styleUrl: './view-product.scss',
})
export class ViewProduct implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  isLoading = true;
  isLoaded = false;
  isSubmitting = false;
  isDeleting = false;
  errorMessage = '';

  productId: number | null = null;

  name = '';
  description = '';
  price: number | null = null;
  categoryId: number | null = null;
  style = '';
  image = '';

  private readonly imagesBaseUrl = 'http://localhost:4200/images/products/';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.errorMessage = 'Producto inválido.';
      this.isLoading = false;
      return;
    }

    this.productId = id;
    this.loadProduct(id);
  }

  private loadProduct(id: number) {
    this.isLoading = true;
    this.isLoaded = false;
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.hydrateForm(product);
        this.isLoading = false;
        this.isLoaded = true;
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.errorMessage = 'No se pudo cargar el producto.';
        this.isLoading = false;
        this.isLoaded = false;
      },
    });
  }

  private hydrateForm(product: any) {
    this.name = String(product?.name ?? '');
    this.description = String(product?.description ?? '');
    this.price = product?.price ?? null;
    this.image = String(product?.image ?? '');

    const category = product?.category;
    const normalizedCategory = Array.isArray(category) ? category[0] : category;

    if (typeof normalizedCategory === 'string') {
      this.categoryId = null;
    } else if (normalizedCategory && typeof normalizedCategory === 'object') {
      this.categoryId = normalizedCategory?.id ? Number(normalizedCategory.id) : null;
    } else {
      this.categoryId = null;
    }

    const styles = product?.styles;
    if (Array.isArray(styles) && styles.length > 0) {
      this.style = String(styles[0] ?? '');
    } else {
      this.style = '';
    }
  }

  get imagePreviewUrl(): string {
    const image = this.image?.trim();

    if (!image) {
      return 'images/error-404.svg';
    }

    if (image.startsWith('http') || image.startsWith('/')) {
      return image;
    }

    return `${this.imagesBaseUrl}${image}`;
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }

  save() {
    if (!this.productId) {
      this.errorMessage = 'Producto inválido.';
      return;
    }

    this.errorMessage = '';

    const price = Number(this.price);

    if (!this.name.trim() || !this.description.trim() || Number.isNaN(price)) {
      this.errorMessage = 'Revisa los campos obligatorios.';
      return;
    }

    const categoryId = this.categoryId ? Number(this.categoryId) : null;
    const style = this.style.trim();
    const image = this.image.trim();

    const payload = {
      name: this.name.trim(),
      description: this.description.trim(),
      price,
      category: categoryId ? [{ id: categoryId }] : [],
      styles: style ? [style] : [],
      image: image || undefined,
    };

    this.isSubmitting = true;

    this.productService.updateProduct(this.productId, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loadProduct(this.productId!);
      },
      error: (err) => {
        console.error('Error updating product', err);
        this.isSubmitting = false;
        this.errorMessage = 'No se pudo guardar el producto.';
      },
    });
  }

  deleteProduct() {
    const id = this.productId;
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
