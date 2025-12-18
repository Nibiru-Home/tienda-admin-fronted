import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductsResponse } from '../models/product.model';
import { HTTPService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly productsRoute: string = '/api/products';

    constructor(private httpService: HTTPService) { }

    getProducts(): Observable<ProductsResponse> {
        return this.httpService.getAll<any>(this.productsRoute) as unknown as Observable<ProductsResponse>;
    }

    deleteProduct(id: number): Observable<void> {
        return this.httpService.deleteById<void>(`${this.productsRoute}/${id}`);
    }

    createProduct(payload: any): Observable<any> {
        return this.httpService.post<any>(this.productsRoute, payload);
    }

    getProductById(id: number): Observable<any> {
        return this.httpService.getById<any>(`${this.productsRoute}/${id}`);
    }

    updateProduct(id: number, payload: any): Observable<any> {
        return this.httpService.update<any>(`${this.productsRoute}/${id}`, payload);
    }

    getProductsCount(): Observable<number> {
        return this.httpService.get<number>(`${this.productsRoute}/count`);
    }
}
