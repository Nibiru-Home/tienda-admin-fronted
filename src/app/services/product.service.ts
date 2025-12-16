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
}
