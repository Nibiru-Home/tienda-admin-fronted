import { Routes } from '@angular/router';
import { Index } from './components/pages/index';

export const routes: Routes = [
    { path: '', redirectTo: 'admin', pathMatch: 'full' },
    { path: 'admin', component: Index },
    
];
