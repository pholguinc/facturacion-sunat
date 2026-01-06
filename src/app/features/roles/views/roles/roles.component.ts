import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  DatatableComponent,
  TableColumn,
  TableAction,
  PaginationParams,
} from '../../../../shared/datatable/datatable.component';
import { RolesService } from '../../services/roles.service';
import { Role, RoleCreateRequest } from '../../interfaces/roles.interface';
import {
  firstValueFrom,
  map,
  timer,
  switchMap,
  finalize,
  tap,
  catchError,
  of,
} from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateRoleDialogComponent } from '../../components/create-role-dialog/create-role-dialog.component';
import { AuthService } from '@/app/features/auth/services/auth.service';
import { NgxToastService } from '@angular-magic/ngx-toast';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    DatatableComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {
  // Datos
  roles: Role[] = [];
  totalItems: number = 0;
  loading: boolean = false;
  currentBranchId: string = '';

  // Configuración de columnas
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: false, type: 'index', width: '80px' },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: true },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      type: 'boolean',
      width: '100px',
    },
  ];

  // Acciones de la tabla
  actions: TableAction[] = [
    {
      icon: 'lock',
      tooltip: 'Gestionar Permisos',
      color: 'primary',
      callback: (row: Role) => this.onPermissionsClick(row),
    },
  ];

  constructor(
    private rolesService: RolesService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private ngxToastService: NgxToastService
  ) {
    const payload = this.authService.getPayload();
    this.currentBranchId = payload?.branchId;
  }

  onParamsChange(params: PaginationParams): void {
    this.loadRoles(params);
  }

  onActionClick(event: { action: string; row: Role }): void {
    console.log('Acción:', event.action, 'Fila:', event.row);

    switch (event.action) {
      case 'edit':
        console.log('Editar rol:', event.row.id);
        break;
    }
  }

  onPermissionsClick(row: Role): void {
    console.log('Gestionar permisos para:', row.name, '(Callback Function)');
    this.router.navigate(['/admin/roles', row.id, 'permissions']);
  }

  onAddClick(): void {
    const dialogRef = this.dialog.open(CreateRoleDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const request: RoleCreateRequest = {
          name: result.name,
          description: result.description,
          branchId: this.currentBranchId,
        };

        this.loading = true;

        timer(1500)
          .pipe(
            switchMap(() => this.rolesService.createRole(request)),
            tap((response) => {
              this.ngxToastService.success({
                title: 'Correcto',
                messages: [response.message],
                delay: 2000,
              });
              this.loadRoles({
                page: 1,
                limit: 10,
              });
            }),
            catchError((error) => {
              console.error(error);
              return of(null);
            }),
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe();
      }
    });
  }

  private async loadRoles(params: PaginationParams): Promise<void> {
    try {
      this.loading = true;
      const response = await firstValueFrom(this.rolesService.getRoles(params));
      this.roles = response.data.items;
      this.totalItems = response.data.totalItems;
    } catch (error) {
      console.error('Error cargando roles', error);
      this.roles = [];
      this.totalItems = 0;
    } finally {
      this.loading = false;
    }
  }
}
