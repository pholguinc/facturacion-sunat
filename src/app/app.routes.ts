import { AdminLayout } from './layouts/admin-layout/admin-layout.component';
import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@/app/features/features.routes').then((m) => m.FEATURES_ROUTES),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/forbidden-error/forbidden-error.component').then(
        (m) => m.ForbiddenErrorComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
