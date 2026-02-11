import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HTTPService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly ordersRoute = '/api/orders';

    constructor(private readonly httpService: HTTPService) { }

    getOrders(): Observable<any[]> {
        return this.httpService.getAll<any>(this.ordersRoute);
    }
}

