import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PermissionsService } from '../../services/permissions.service';
import { RolesService } from '../../services/roles.service';
import { Module, Permission } from '../../interfaces/permissions.interface';
import { PaginationParams } from '@/app/shared/datatable/datatable.component';
import {
  catchError,
  finalize,
  firstValueFrom,
  map,
  of,
  tap,
  timer,
  switchMap,
} from 'rxjs';
import { RoleUpdateRequest } from '../../interfaces/roles.interface';
import { ControlErrorsDirective } from '@/app/core/directives/control-error.directive';
import { FormSubmitDirective } from '@/app/core/directives/form-submit.directive';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    ControlErrorsDirective,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class PermissionsComponent implements OnInit {
  roleId: string | null = null;
  roleForm: FormGroup;
  permissionsForm: FormGroup;

  modules = signal<Module[]>([]);
  loading = signal<boolean>(false);
  saving = signal<boolean>(false);

  // Pagination
  totalItems = 0;
  page = 1;
  limit = 8;
  search = '';

  assignedPermissionIds = signal<Set<string>>(new Set());
  currentBranchId = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private permissionsService: PermissionsService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private location: Location,
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    this.permissionsForm = this.fb.group({
      permissions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');
    if (this.roleId) {
      this.loadRoleDetails(this.roleId);
    } else {
      this.loadPermissions();
    }
  }

  async loadRoleDetails(id: string) {
    try {
      const response = await firstValueFrom(this.rolesService.getRoleById(id));
      if (response && response.data) {
        this.roleForm.patchValue({
          name: response.data.name,
          description: response.data.description,
        });
        this.currentBranchId.set(response.data.branchId);
        this.assignedPermissionIds.set(
          new Set(response.data.permissions.map((p) => p.id)),
        );
        this.loadPermissions();
      }
    } catch (error) {
      console.error('Error loading role details', error);
      // Fallback to loading permissions anyway
      this.loadPermissions();
    }
  }

  async loadPermissions() {
    this.loading.set(true);
    const params: PaginationParams = {
      page: this.page,
      limit: this.limit,
      search: this.search,
    };

    try {
      const response = await firstValueFrom(
        this.permissionsService.getPermissions(params),
      );
      const modulesData = response.data.modules;
      this.totalItems = response.data.totalItems;

      // Mark assigned permissions as active
      if (this.assignedPermissionIds().size > 0) {
        modulesData.forEach((module) => {
          let allActive = true;
          let hasActive = false;

          module.permissions.forEach((permission) => {
            if (this.assignedPermissionIds().has(permission.id)) {
              permission.isActive = true;
              hasActive = true;
            } else {
              permission.isActive = false;
              allActive = false;
            }
          });
          module.isActive = allActive && module.permissions.length > 0;
        });
      }
      this.modules.set(modulesData);
    } catch (error) {
      console.error('Error loading permissions', error);
      this.modules.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadPermissions();
  }

  goBack() {
    this.location.back();
  }

  toggleModule(module: Module, event: any) {
    const isChecked = event.checked;
    this.modules.update((currentModules) => {
      const targetModule = currentModules.find((m) => m.id === module.id); // Assuming module has ID or reference match
      if (targetModule) {
        targetModule.isActive = isChecked;
        targetModule.permissions.forEach((p) => (p.isActive = isChecked));
      }
      return [...currentModules]; // Return new reference to trigger update
    });

    if (isChecked) {
      const modulePermissionIds = module.permissions.map((p) => p.id).join(',');
      console.log('Module IDs:', modulePermissionIds);
    }
  }

  togglePermission(permission: Permission, event: any) {
    this.modules.update((currentModules) => {
      permission.isActive = event.checked;
      return [...currentModules];
    });
  }

  toggleAll(event: any) {
    const isChecked = event.checked;
    this.modules.update((currentModules) => {
      currentModules.forEach((module) => {
        module.isActive = isChecked;
        module.permissions.forEach((p) => (p.isActive = isChecked));
      });
      return [...currentModules];
    });

    if (isChecked) {
      const allPermissionIds = this.modules()
        .flatMap((m) => m.permissions)
        .map((p) => p.id)
        .join(',');
      console.log('All IDs:', allPermissionIds);
    }
  }

  save() {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      console.log('Saving Role:', formValue);
      const selectedPermissions: string[] = [];
      this.modules().forEach((m) => {
        m.permissions.forEach((p) => {
          if (p.isActive) selectedPermissions.push(p.id);
        });
      });

      const request: RoleUpdateRequest = {
        name: formValue.name,
        branchId: this.currentBranchId(),
        description: formValue.description,
        permissions: selectedPermissions,
      };
      this.saving.set(true);
      this.loading.set(true);

      timer(1500)
        .pipe(
          switchMap(() => this.rolesService.updateRole(this.roleId!, request)),
          map((response) => {
            return response;
          }),
          tap((response) => {
            console.log('response', response);
            if (response.statusCode === 200) {
              this.assignedPermissionIds.set(new Set(selectedPermissions));
              this.loadPermissions();
            }
          }),
          catchError((error) => {
            console.log(error);
            return of(null);
          }),
          finalize(() => {
            this.saving.set(false);
            this.loading.set(false);
          }),
        )
        .subscribe();
      console.log('Selected IDs:', selectedPermissions);
    }
  }
}
