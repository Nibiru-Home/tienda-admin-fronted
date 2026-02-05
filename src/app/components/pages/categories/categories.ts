import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/product.model';
import { CategoryService } from '../../../services/category.service';
import { CFormCard } from '../../ui/c-form-card/c-form-card';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, CSidebar, CFormCard],
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  name = '';
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  formError = '';
  successMessage = '';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.errorMessage = 'No se pudieron cargar las categorías.';
        this.isLoading = false;
      }
    });
  }

  submit() {
    this.formError = '';
    this.successMessage = '';

    const name = this.name.trim();
    if (!name) {
      this.formError = 'Ingresa un nombre para la categoría.';
      return;
    }

    const exists = this.categories.some((category) =>
      (category?.name ?? '').trim().toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      this.formError = 'Ya existe una categoría con ese nombre.';
      return;
    }

    this.isSubmitting = true;
    this.categoryService.createCategory({ name }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Categoría creada correctamente.';
        this.name = '';
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error creating category', err);
        this.isSubmitting = false;
        this.formError = 'No se pudo crear la categoría.';
      }
    });
  }

  deleteCandidateId: number | null = null;
  isDeleting = false;
  showCreateModal = false;

  addCategory() {
    this.showCreateModal = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.formError = '';
    this.name = '';
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  deleteCategory(id?: number) {
    if (!id) return;
    this.deleteCandidateId = id;
  }

  cancelDelete() {
    this.deleteCandidateId = null;
  }

  confirmDelete() {
    if (!this.deleteCandidateId) return;

    this.isDeleting = true;
    this.errorMessage = '';

    this.categoryService.deleteCategory(this.deleteCandidateId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.deleteCandidateId = null;
        this.successMessage = 'Categoría eliminada correctamente.';
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error deleting category', err);
        this.isDeleting = false;
        this.deleteCandidateId = null;
        this.errorMessage = 'No se pudo eliminar la categoría.';
      }
    });
  }
}
