
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, Category } from '../../../models/product.model';

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
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  products: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  deleteCandidateId: number | null = null;
  isDeleting = false;

  get filteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(product =>
      product.category.some(cat => cat.name === this.selectedCategory)
    );
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data.map((c: Category) => c.name).sort((a: string, b: string) => a.localeCompare(b));
      },
      error: (err: any) => {
        console.error('Error loading categories', err);
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
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
    this.deleteCandidateId = id;
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
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.isDeleting = false;
        this.deleteCandidateId = null;
      }
    });
  }
}
