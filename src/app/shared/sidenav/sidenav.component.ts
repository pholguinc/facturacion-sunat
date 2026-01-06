import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { ShowForPermissionDirective } from '../directives/show-for-permission.directive';

interface RouteLink {
  link: string;
  name: string;
  icon: string;
  badge?: number;
  permission?: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgFor,
    NgClass,
    ShowForPermissionDirective,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class Sidenav {
  @Input() isExpanded: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  public menuItems: RouteLink[] = [
    {
      link: '/admin/home',
      name: 'Dashboard',
      icon: 'dashboard',
      permission: 'view.dashboard',
    },
    {
      link: '/admin/facturas',
      name: 'Facturas',
      icon: 'receipt',
      permission: 'list.invoices',
    },
    {
      link: '/admin/boletas',
      name: 'Boletas',
      icon: 'description',
      permission: 'list.bills',
    },
    {
      link: '/admin/notas-credito',
      name: 'Notas de Crédito',
      icon: 'credit_card',
      permission: 'list.credit-notes',
    },
    {
      link: '/admin/notas-debito',
      name: 'Notas de Débito',
      icon: 'money_off',
      permission: 'list.debit-notes',
    },
    {
      link: '/admin/guias-remision',
      name: 'Guías de Remisión',
      icon: 'local_shipping',
      permission: 'list.shipping-guides',
    },
  ];

  public configItems: RouteLink[] = [
    {
      link: '/admin/clientes',
      name: 'Clientes',
      icon: 'people',
      permission: 'ver-clientes',
    },
    {
      link: '/admin/roles',
      name: 'Roles',
      icon: 'manage_accounts',
    },
    {
      link: '/admin/usuarios',
      name: 'Usuarios',
      icon: 'people',
      permission: 'ver-usuarios',
    },
    {
      link: '/admin/series-correlatives',
      name: 'Series y Correlativos',
      icon: 'format_list_numbered',
      permission: 'list.series.correlatives',
    },
    {
      link: '/admin/reportes',
      name: 'Reportes',
      icon: 'bar_chart',
      permission: 'view.reports',
    },
    {
      link: '/admin/configuracion',
      name: 'Configuración',
      icon: 'settings',
      permission: 'view.configuration',
    },
  ];
}
