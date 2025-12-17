import { Component } from '@angular/core';
import { CSidebar } from '../../ui/c-sidebar/c-sidebar';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [CSidebar],
  templateUrl: './error-404.html',
  styleUrl: './error-404.scss',
})
export class Error404 {}
