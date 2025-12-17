
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  products: Product[] = [];

  ngOnInit() {
    this.loadProducts();
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

  addProduct() {
    console.log('Add product');
  }

  editProduct(id: number) {
    console.log('Edit product', id);
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
