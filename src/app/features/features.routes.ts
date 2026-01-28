import { Routes } from '@angular/router';
import { permissionsGuard } from '@/app/core/guards/permissions.guard';

export const FEATURES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/app/layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayout,
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
            (m) => m.RolesComponent,
          ),
        title: 'Roles',
        data: { breadcrumb: 'Roles' },
      },
      {
        path: 'roles/:id/permissions',
        loadComponent: () =>
          import('@/app/features/roles/views/permissions/permissions.component').then(
            (m) => m.PermissionsComponent,
          ),
        title: 'Permisos',
        data: { breadcrumb: 'Permisos' },
      },
      {
        path: 'series-correlatives',
        loadComponent: () =>
          import('@/app/features/series-correlatives/series-correlatives.component').then(
            (m) => m.SeriesCorrelativesComponent,
          ),
        title: 'Series y Correlativos',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Series y Correlativos',
          permission: 'list.series.correlatives',
        },
      },
      {
        path: 'tipo-comprobante',
        loadComponent: () =>
          import('@/app/features/receipt-types/receipt-types.component').then(
            (m) => m.ReceiptTypesComponent,
          ),
        title: 'Tipo de Comprobante',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Tipo de Comprobante',
        },
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('@/app/features/companies/companies.component').then(
            (m) => m.CompaniesComponent,
          ),
        title: 'Empresas',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Empresas',
        },
      },
      {
        path: 'empresas/:id',
        loadComponent: () =>
          import('@/app/features/companies/components/create-new-company/create-new-company.component').then(
            (m) => m.CreateNewCompanyComponent,
          ),
        title: 'Nueva Empresa',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Nueva Empresa',
        },
      },
      {
        path: 'facturas/:receiptTypeId',
        loadComponent: () =>
          import('@/app/features/invoices/invoices.component').then(
            (m) => m.InvoicesComponent,
          ),
        title: 'Facturas',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Facturas',
        },
      },
      {
        path: 'facturas/:receiptTypeId/0',
        loadComponent: () =>
          import('@/app/features/invoices/components/new-invoice/new-invoice.component').then(
            (m) => m.NewInvoiceComponent,
          ),
        title: 'Nueva Factura',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Nueva Factura',
        },
      },
      {
        path: 'boletas/:receiptTypeId',
        loadComponent: () =>
          import('@/app/features/invoices/invoices.component').then(
            (m) => m.InvoicesComponent,
          ),
        title: 'Boletas',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Boletas',
        },
      },
      {
        path: 'notas-credito/:receiptTypeId',
        loadComponent: () =>
          import('@/app/features/invoices/invoices.component').then(
            (m) => m.InvoicesComponent,
          ),
        title: 'Notas de Crédito',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Notas de Crédito',
        },
      },
      {
        path: 'notas-debito/:receiptTypeId',
        loadComponent: () =>
          import('@/app/features/invoices/invoices.component').then(
            (m) => m.InvoicesComponent,
          ),
        title: 'Notas de Débito',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Notas de Débito',
        },
      },
      {
        path: 'guias-remision/:receiptTypeId',
        loadComponent: () =>
          import('@/app/features/invoices/invoices.component').then(
            (m) => m.InvoicesComponent,
          ),
        title: 'Guías de Remisión',
        canActivate: [permissionsGuard],
        data: {
          breadcrumb: 'Guías de Remisión',
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
