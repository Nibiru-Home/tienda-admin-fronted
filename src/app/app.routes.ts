import { Routes } from '@angular/router';

import { Login } from './components/pages/login/login';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
import { Index } from './components/pages/index/index';
import { Error404 } from './components/pages/error-404/error-404';
import { ProductsComponent } from './components/pages/products/products.component';

export const routes: Routes = [
    { path: 'admin/login', component: Login, canActivate: [guestGuard] },
    { path: 'admin', component: Index, canActivate: [authGuard] },
    { path: 'admin/products', component: ProductsComponent, canActivate: [authGuard] },
    { path: 'admin/orders', component: Error404, canActivate: [authGuard] },
    { path: 'admin/categories', component: Error404, canActivate: [authGuard] },
    { path: '**', redirectTo: 'admin/login' }
];
