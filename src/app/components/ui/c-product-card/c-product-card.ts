import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';

@Component({
    selector: 'c-product-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './c-product-card.html',
    styleUrl: './c-product-card.scss'
})
export class CProductCard {
    @Input({ required: true }) product!: Product;
    @Output() view = new EventEmitter<number>();
    @Output() edit = new EventEmitter<number>();
    @Output() delete = new EventEmitter<number>();

    private readonly baseUrl = 'http://localhost:4200/images/products/';

    get imageUrl(): string {
        if (!this.product.image) {
            return 'images/error-404.svg';
        }
        if (this.product.image.startsWith('http') || this.product.image.startsWith('/')) {
            return this.product.image;
        }
        return `${this.baseUrl}${this.product.image}`;
    }

    onView() {
        this.view.emit(this.product.id);
    }

    onEdit(event?: Event) {
        event?.stopPropagation();
        this.edit.emit(this.product.id);
    }

    onDelete(event?: Event) {
        event?.stopPropagation();
        this.delete.emit(this.product.id);
    }
}
