
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

import { CProductCard } from '../../ui/c-product-card/c-product-card';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CSidebar, CProductCard],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);

  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';

  get filteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(product =>
      product.category.some(cat => cat.name === this.selectedCategory)
    );
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        // Extract unique categories and filter out any falsy values
        const allCategories = data.flatMap(p => p.category).map(c => c.name);
        this.categories = [...new Set(allCategories.filter(c => !!c))];
      },
      error: (err) => {
        console.error('Error loading products', err);
      }
    });
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
  }

  addProduct() {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products', id]);
  }

  viewProduct(id: number) {
    this.router.navigate(['/admin/products', id]);
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); // Reload list
        },
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }
}
