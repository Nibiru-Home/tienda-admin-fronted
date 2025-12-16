import { Routes } from '@angular/router';

import { Login } from './components/pages/login/login';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
import { Index } from './components/pages/index/index';

export const routes: Routes = [
    { path: 'admin/login', component: Login, canActivate: [guestGuard] },
    { path: 'admin', component: Index, canActivate: [authGuard] },
    { path: '**', redirectTo: 'admin/login' }
];