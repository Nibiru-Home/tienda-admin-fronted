import { Routes } from '@angular/router';

import { Login } from './components/pages/login/login';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
import { Index } from './components/pages/index/index';
import { Error404 } from './components/pages/error-404/error-404';
import { ProductsComponent } from './components/pages/products/products';
import { AddProduct } from './components/pages/add-product/add-product';
import { EditProduct } from './components/pages/edit-product/edit-product';
import { ViewProduct } from './components/pages/view-product/view-product';

export const routes: Routes = [
    { path: 'admin/login', component: Login, canActivate: [guestGuard] },
    { path: 'admin', component: Index, canActivate: [authGuard] },
    { path: 'admin/products/new', component: AddProduct, canActivate: [authGuard] },
    { path: 'admin/products/:id/edit', component: EditProduct, canActivate: [authGuard] },
    { path: 'admin/products/:id', component: ViewProduct, canActivate: [authGuard] },
    { path: 'admin/products', component: ProductsComponent, canActivate: [authGuard] },
    { path: 'admin/orders', component: Error404, canActivate: [authGuard] },
    { path: 'admin/categories', component: Error404, canActivate: [authGuard] },
    { path: '**', redirectTo: 'admin/login' }
];
