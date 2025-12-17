import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type DashboardStat = {
  label: string;
  value: string | number;
};

@Component({
  selector: 'c-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './c-dashboard-stats.html',
  styleUrl: './c-dashboard-stats.scss',
})
export class CDashboardStats {
  @Input({ required: true }) stats: DashboardStat[] = [];
}

