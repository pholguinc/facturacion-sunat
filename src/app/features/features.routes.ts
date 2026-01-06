import { Routes } from '@angular/router';
import { permissionsGuard } from '@/app/core/guards/permissions.guard';

export const FEATURES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/app/layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayout
      ),
    data: { breadcrumb: 'Inicio' },
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('@/app/features/home/home.component').then((m) => m.Home),
        title: 'Home',
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('@/app/features/roles/views/roles/roles.component').then(
            (m) => m.RolesComponent
          ),
        title: 'Roles',
        data: { breadcrumb: 'Roles' },
      },
      {
        path: 'roles/:id/permissions',
        loadComponent: () =>
          import(
            '@/app/features/roles/views/permissions/permissions.component'
          ).then((m) => m.PermissionsComponent),
        title: 'Permisos',
        data: { breadcrumb: 'Permisos' },
      },
      {
        path: 'series-correlatives',
        loadComponent: () =>
          import(
            '@/app/features/series-correlatives/series-correlatives.component'
          ).then((m) => m.SeriesCorrelativesComponent),
        title: 'Series y Correlativos',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Series y Correlativos',
          permission: 'list.series.correlatives',
        },
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
