import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'c-form-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './c-form-card.html',
  styleUrl: './c-form-card.scss',
})
export class CFormCard {
  @Input() title = '';
  @Input() cardWidth: string | null = null;
  @Input() titleSize: string | null = null;
}
