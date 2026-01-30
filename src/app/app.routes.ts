import { Routes } from '@angular/router';

import { Login } from './components/pages/login/login';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
import { Index } from './components/pages/index/index';
import { Error404 } from './components/pages/error-404/error-404';
import { ProductsComponent } from './components/pages/products/products';
import { AddProduct } from './components/pages/add-product/add-product';
import { ViewProduct } from './components/pages/view-product/view-product';
import { Users } from './components/pages/users/users';
import { Categories } from './components/pages/categories/categories';

export const routes: Routes = [
    { path: 'admin/login', component: Login, canActivate: [guestGuard] },
    { path: 'admin', component: Index, canActivate: [authGuard] },
    { path: 'admin/products/new', component: AddProduct, canActivate: [authGuard] },
    { path: 'admin/products/:id', component: ViewProduct, canActivate: [authGuard] },
    { path: 'admin/products', component: ProductsComponent, canActivate: [authGuard] },
    { path: 'admin/users', component: Users, canActivate: [authGuard] },
    { path: 'admin/orders', component: Error404, canActivate: [authGuard] },
    { path: 'admin/categories', component: Categories, canActivate: [authGuard] },
    { path: '**', redirectTo: 'admin/login' }
];
