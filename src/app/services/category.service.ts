import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/product.model';
import { HTTPService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly categoriesRoute = '/api/categories';

  constructor(private httpService: HTTPService) { }

  getCategories(): Observable<Category[]> {
    return this.httpService.getAll<Category>(this.categoriesRoute);
  }

  createCategory(payload: { name: string }): Observable<Category> {
    return this.httpService.post<Category>(this.categoriesRoute, payload);
  }

  deleteCategory(id: number): Observable<void> {
    return this.httpService.deleteById<void>(`${this.categoriesRoute}/${id}`);
  }

  getCategoryByName(name: string): Observable<Category> {
    return this.httpService.getById<Category>(`${this.categoriesRoute}/search/name/${name}`);
  }
}
