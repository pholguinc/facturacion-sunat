import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter, map } from 'rxjs/operators';

interface Breadcrumb {
    label: string;
    url: string;
}

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterLink, MatIconModule],
    template: `
    <nav class="breadcrumb-container" *ngIf="breadcrumbs.length > 0">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item" *ngFor="let breadcrumb of breadcrumbs; let last = last">
          <a *ngIf="!last" [routerLink]="breadcrumb.url" class="breadcrumb-link">
            <mat-icon *ngIf="breadcrumb.label === 'Inicio'" class="home-icon">home</mat-icon>
            <span>{{ breadcrumb.label }}</span>
          </a>
          <span *ngIf="last" class="breadcrumb-current">{{ breadcrumb.label }}</span>
          <mat-icon *ngIf="!last" class="separator">chevron_right</mat-icon>
        </li>
      </ol>
    </nav>
  `,
    styles: [`
    .breadcrumb-container {
      padding: 12px 0;
      margin-bottom: 16px;
    }

    .breadcrumb-list {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      flex-wrap: wrap;
      gap: 4px;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
    }

    .breadcrumb-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--mat-sys-primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.7;
      }

      .home-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .breadcrumb-current {
      color: #666;
      font-size: 14px;
      font-weight: 400;
    }

    .separator {
      color: #999;
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin: 0 4px;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
    breadcrumbs: Breadcrumb[] = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.buildBreadcrumbs(this.activatedRoute.root))
            )
            .subscribe(breadcrumbs => {
                this.breadcrumbs = breadcrumbs;
            });

        // Initial breadcrumb
        this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
    }

    private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const label = child.snapshot.data['breadcrumb'];

            if (label) {
                breadcrumbs.push({ label, url });
            }

            return this.buildBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
