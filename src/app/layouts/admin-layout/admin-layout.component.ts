import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidenav } from '@/app/shared/sidenav/sidenav.component';
import { Navbar } from '@/app/shared/navbar/navbar.component';
import { Footer } from '@/app/shared/footer/footer.component';
import { BreadcrumbComponent } from '@/app/shared/breadcrumb/breadcrumb.component';
import { NgClass } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    Sidenav,
    Navbar,
    Footer,
    RouterOutlet,
    NgClass,
    BreadcrumbComponent,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayout implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public isExpanded = true;
  public isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Observe screen size changes
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.isExpanded = false; // Collapse by default on mobile
        } else {
          this.isExpanded = true; // Expand by default on desktop
        }
      });

    // Close sidebar on mobile navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.isMobile && this.sidenav && this.sidenav.opened) {
          this.sidenav.close();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleMenu() {
    this.isExpanded = !this.isExpanded;

    // On mobile, toggling actually opens/closes the drawer
    if (this.isMobile && this.sidenav) {
      this.sidenav.toggle();
    }
  }
}
