import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthLoginResponse } from '../interfaces/auth-login.response';
import { CookieService } from 'ngx-cookie-service';
import { LoginRequest } from '../interfaces/auth-login.request';
import { Router } from '@angular/router';
import { RolesService } from '../../roles/services/roles.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();
  private permissionsLoadedSubject = new BehaviorSubject<boolean>(false);
  public permissionsLoaded$ = this.permissionsLoadedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private rolesService: RolesService
  ) {
    if (this.isAuthenticated()) {
      this.loadPermissions();
    }
  }

  login(request: LoginRequest): Observable<AuthLoginResponse> {
    return this.http
      .post<AuthLoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap(() => this.loadPermissions()));
  }

  getToken(): string {
    return this.cookieService.get('access_token');
  }

  removeToken(): void {
    this.cookieService.delete('access_token');
    this.permissionsSubject.next([]);
    this.router.navigate(['/auth/login']);
  }

  setToken(value: string): void {
    this.cookieService.set('access_token', value, {
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });
  }

  isAuthenticated(): boolean {
    const payload = this.getPayload();
    if (!payload) return false;
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  getPayload() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  loadPermissions() {
    const payload = this.getPayload();
    if (!payload?.roleId) return;

    this.rolesService.getRoleById(payload.roleId).subscribe({
      next: (resp) => {
        if (resp.data?.permissions) {
          // Map objects to slugs (Ensure we extract slug)
          const slugs = resp.data.permissions.map((p: any) => p.slug || p);
          this.permissionsSubject.next(slugs);
          console.log('✅ Permissions Slugs:', slugs);
        }
        this.permissionsLoadedSubject.next(true);
      },
      error: (err) => {
        console.error('Error loading permissions', err);
        this.permissionsLoadedSubject.next(true);
      },
    });
  }

  hasPermission(permission: string): boolean {
    const has = this.permissionsSubject.value.includes(permission);
    if (!has)
      console.log(
        '⛔ Check Failed:',
        permission,
        'Stored:',
        this.permissionsSubject.value
      );
    return has;
  }
}
