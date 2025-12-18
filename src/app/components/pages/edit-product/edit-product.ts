import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { ProductService } from '../../../services/product.service';
import { CFormCard } from '../../ui/c-form-card/c-form-card';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, CSidebar, CFormCard],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss'
})
export class EditProduct implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  productId: number | null = null;

  name = '';
  description = '';
  price: number | null = null;
  categoryId: number | null = null;
  style = '';
  image = '';

  private currentStock = 0;

  isLoading = true;
  isSubmitting = false;
  errorMessage = '';

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
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.name = String(product?.name ?? '');
        this.description = String(product?.description ?? '');
        this.price = product?.price ?? null;
        this.image = String(product?.image ?? '');

        this.currentStock = Number(product?.stock ?? 0);

        const category = product?.category;
        if (Array.isArray(category) && category[0]?.id) {
          this.categoryId = Number(category[0].id);
        } else if (category?.id) {
          this.categoryId = Number(category.id);
        } else {
          this.categoryId = null;
        }

        const styles = product?.styles;
        if (Array.isArray(styles) && styles.length > 0) {
          this.style = String(styles[0] ?? '');
        } else {
          this.style = '';
        }

        this.isLoading = false;
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }

  submit() {
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
      stock: this.currentStock,
      category: categoryId ? [{ id: categoryId }] : [],
      styles: style ? [style] : [],
      image: image || undefined
    };

    this.isSubmitting = true;
    this.productService.updateProduct(this.productId, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/products']);
      },
    });
  }
}
