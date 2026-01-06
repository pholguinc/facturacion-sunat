import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appShowForPermission]',
  standalone: true,
})
export class ShowForPermissionDirective implements OnInit, OnDestroy {
  private permission: string = '';
  private sub?: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appShowForPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  ngOnInit(): void {
    // Subscribe to permission changes to react when they are loaded
    this.sub = this.authService.permissions$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateView() {
    this.viewContainer.clear();

    // If no permission is required, show the element
    if (!this.permission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Check if user has the specific permission
    if (this.authService.hasPermission(this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
