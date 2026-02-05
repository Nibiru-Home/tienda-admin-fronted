import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
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
  private categoryService = inject(CategoryService);

  isLoading = true;
  isLoaded = false;
  isSubmitting = false;
  isDeleting = false;
  errorMessage = '';
  showDeleteConfirm = false;

  productId: number | null = null;

  name = '';
  description = '';
  price: number | null = null;
  categoryId: number | null = null;
  categoryName: string = '';
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
      this.categoryName = normalizedCategory;
    } else if (normalizedCategory && typeof normalizedCategory === 'object') {
      this.categoryId = normalizedCategory?.id ? Number(normalizedCategory.id) : null;
      this.categoryName = normalizedCategory?.name ? String(normalizedCategory.name) : '';
    } else {
      this.categoryId = null;
      this.categoryName = '';
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

    this.isSubmitting = true;

    // Helper to proceed with update
    const performUpdate = (finalCategoryId: number | null) => {
      const style = this.style.trim();
      const image = this.image.trim();

      const payload = {
        id: this.productId,
        name: this.name.trim(),
        description: this.description.trim(),
        price,
        category: finalCategoryId ? [{ id: finalCategoryId }] : [],
        styles: style ? [style] : [],
        image: image || undefined,
      };

      this.productService.updateProduct(this.productId!, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error updating product', err);
          this.isSubmitting = false;
          this.errorMessage = 'No se pudo guardar el producto.';
        }
      });
    };

    const categoryNameClean = this.categoryName.trim();
    if (!categoryNameClean) {
      this.errorMessage = 'La categoría es obligatoria.';
      this.isSubmitting = false;
      return;
    }

    // Try to find category by name
    this.categoryService.getCategoryByName(categoryNameClean).subscribe({
      next: (cat) => {
        performUpdate(cat.id);
      },
      error: () => {
        // Not found, ERROR
        this.isSubmitting = false;
        this.errorMessage = `La categoría "${categoryNameClean}" no existe.`;
      }
    });
  }

  openDeleteConfirm() {
    if (this.isSubmitting || this.isDeleting) {
      return;
    }
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    if (this.isDeleting) {
      return;
    }
    this.showDeleteConfirm = false;
  }

  confirmDelete() {
    const id = this.productId;
    if (!id || this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';
    this.showDeleteConfirm = false;

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
