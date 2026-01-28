import { NgFor, NgIf, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { ReceiptTypesService } from '../../features/receipt-types/services/receipt-type.service';
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
export class Sidenav implements OnInit {
  @Input() isExpanded: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();

  receiptTypes = signal<any[]>([]);

  constructor(
    public authService: AuthService,
    private receiptTypesService: ReceiptTypesService,
  ) {}

  ngOnInit() {
    this.loadReceiptTypes();
  }

  private loadReceiptTypes() {
    this.receiptTypesService
      .getReceiptTypes({ page: 1, limit: 100 })
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            const items = response.data.items;
            this.receiptTypes.set(items);
            this.updateMenuItems(items);
          }
        },
        error: (err) =>
          console.error('Error loading receipt types in sidenav', err),
      });
  }

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

  private updateMenuItems(types: any[]) {
    const updatedMenuItems = this.menuItems.map((item) => {
      // Don't apppend ID if it's already there or if it's the dashboard
      if (item.link === '/admin/home' || item.link.split('/').length > 3)
        return item;

      const type = types.find((t) =>
        t.name.toLowerCase().includes(item.name.toLowerCase().replace('s', '')),
      );
      if (type) {
        return {
          ...item,
          link: `${item.link}/${type.id}`,
        };
      }
      return item;
    });
    this.menuItems = updatedMenuItems;
  }

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
      link: '/admin/tipo-comprobante',
      name: 'Tipo de Comprobante',
      icon: 'receipt_long',
    },
    {
      link: '/admin/empresas',
      name: 'Empresas',
      icon: 'business',
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
