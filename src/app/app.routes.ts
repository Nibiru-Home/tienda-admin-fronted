import { Routes } from '@angular/router';

import { Login } from './components/pages/login/login';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
    { path: 'admin/login', component: Login, canActivate: [guestGuard] },
    { path: '**', redirectTo: 'admin/login' }
];