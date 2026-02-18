import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Order, OrderItem } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, CSidebar],
    templateUrl: './orders.html',
    styleUrl: './orders.scss',
})
export class Orders implements OnInit {
    private readonly orderService = inject(OrderService);

    orders: Order[] = [];
    isLoading = true;
    errorMessage = '';
    selectedOrder: Order | null = null;

    ngOnInit(): void {
        this.loadOrders();
    }

    private loadOrders(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.orderService.getOrders().subscribe({
            next: (orders) => {
                const normalized = (orders as unknown as any[])
                    .map((order) => this.normalizeOrder(order))
                    .sort((a, b) => this.getDateScore(b.date) - this.getDateScore(a.date));

                this.orders = normalized;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading orders', err);
                this.errorMessage = 'No se pudieron cargar los pedidos.';
                this.isLoading = false;
            }
        });
    }

    getStatusLabel(status: string): string {
        const normalizedStatus = status.trim().toUpperCase();
        if (normalizedStatus === 'PAID') return 'Pagado';
        if (normalizedStatus === 'PENDING') return 'Pendiente';
        if (normalizedStatus === 'COMPLETED') return 'Completado';
        if (normalizedStatus === 'CANCELLED') return 'Cancelado';
        return status || '-';
    }

    getStatusClass(status: string): string {
        const normalizedStatus = status.trim().toUpperCase();
        if (normalizedStatus === 'PAID' || normalizedStatus === 'COMPLETED') {
            return 'c-orders__status c-orders__status--ok';
        }
        if (normalizedStatus === 'PENDING') {
            return 'c-orders__status c-orders__status--pending';
        }
        if (normalizedStatus === 'CANCELLED') {
            return 'c-orders__status c-orders__status--cancelled';
        }
        return 'c-orders__status';
    }

    formatAmount(amount: number): string {
        return new Intl.NumberFormat('es-es', {
            style: 'currency',
            currency: 'EUR'
        }).format(Number.isFinite(amount) ? amount : 0);
    }

    formatDate(date: string | number): string {
        let parsed: Date;
        if (typeof date === 'number') {
            parsed = new Date(date);
        } else if (/^\d+$/.test(date.trim())) {
            parsed = new Date(Number(date));
        } else {
            parsed = new Date(date);
        }

        if (Number.isNaN(parsed.getTime())) {
            return '-';
        }

        return new Intl.DateTimeFormat('es-es', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(parsed);
    }

    openDetails(order: Order): void {
        this.selectedOrder = order;
    }

    closeDetails(): void {
        this.selectedOrder = null;
    }

    getOrderTotal(order: Order): number {
        if (Number.isFinite(order.total) && order.total > 0) {
            return order.total;
        }
        return order.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    getItemsSubtotal(order: Order): number {
        return order.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    getShippingAmount(order: Order): number {
        const shipping = this.getOrderTotal(order) - this.getItemsSubtotal(order);
        return shipping > 0 ? Number(shipping.toFixed(2)) : 0;
    }

    private normalizeOrder(order: any): Order {
        const itemsRaw = Array.isArray(order?.cart?.items) ? order.cart.items : [];
        const items = itemsRaw.map((item: any) => this.normalizeOrderItem(item));

        return {
            id: String(order?.id ?? ''),
            customerName: String(order?.user?.name ?? ''),
            customerEmail: String(order?.user?.email ?? ''),
            customerPhone: String(order?.user?.phone ?? ''),
            customerAddress: String(order?.user?.address ?? ''),
            total: Number(order?.total ?? 0),
            date: order?.date ?? '',
            status: String(order?.status ?? ''),
            cartId: order?.cart?.id != null ? Number(order.cart.id) : null,
            items,
        };
    }

    private normalizeOrderItem(item: any): OrderItem {
        const quantity = Number(item?.quantity ?? 0);
        const unitPrice = Number(item?.product?.price ?? 0);

        return {
            id: Number(item?.id ?? 0),
            quantity: Number.isFinite(quantity) ? quantity : 0,
            productId: Number(item?.product?.id ?? 0),
            productName: String(item?.product?.name ?? ''),
            unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
            subtotal: (Number.isFinite(unitPrice) ? unitPrice : 0) * (Number.isFinite(quantity) ? quantity : 0),
        };
    }

    private getDateScore(value: string | number): number {
        const parsedValue = typeof value === 'number'
            ? value
            : (/^\d+$/.test(value.trim()) ? Number(value) : value);

        const timestamp = new Date(parsedValue).getTime();
        return Number.isNaN(timestamp) ? 0 : timestamp;
    }
}
