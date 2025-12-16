
import { Component } from '@angular/core';
import { CSidebar} from '../../ui/c-sidebar/c-sidebar';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CSidebar],
  templateUrl: './index.html',
  styleUrl: './index.scss'
})
export class Index {}
