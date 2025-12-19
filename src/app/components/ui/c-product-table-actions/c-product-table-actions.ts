import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'c-product-table-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './c-product-table-actions.html',
  styleUrl: './c-product-table-actions.scss'
})
export class CProductTableActions {
  @Input({ required: true }) productId!: number;
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.productId);
  }

  onRemove() {
    this.remove.emit(this.productId);
  }
}
