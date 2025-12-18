import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { ProductService } from '../../../services/product.service';
import { CFormCard } from '../../ui/c-form-card/c-form-card';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, CSidebar, CFormCard],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct {
  private router = inject(Router);
  private productService = inject(ProductService);

  name = '';
  description = '';
  price: number | null = null;
  categoryId: number | null = null;
  style = '';
  image = '';

  isSubmitting = false;
  errorMessage = '';

  cancel() {
    this.router.navigate(['/admin/products']);
  }

  submit() {
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
      stock: 0,
      category: categoryId ? [{ id: categoryId }] : [],
      styles: style ? [style] : [],
      image: image || undefined
    };

    this.isSubmitting = true;
    this.productService.createProduct(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error creating product', err);
        this.isSubmitting = false;
        this.errorMessage = 'No se pudo crear el producto.';
      }
    });
  }
}
