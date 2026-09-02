import { Routes } from '@angular/router';
import { authGuard } from './app/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./app/dashboard/dashboard.component').then(module => module.DashboardComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./app/home/home.component').then(module => module.HomeComponent),
  },
  {
    path: 'newsletter',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./app/header/login/register/register.component').then(module => module.RegisterComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./app/profile/profile.component').then(module => module.ProfileComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./app/cart/cart.component').then(module => module.CartComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./app/products/products.component').then(module => module.ProductsComponent),
  },
  {
    path: 'product/:product_id',
    loadComponent: () => import('./app/product/product.component').then(module => module.ProductComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./app/about/about.component').then(module => module.AboutComponent),
  }
];
