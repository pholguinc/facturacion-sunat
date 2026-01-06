import { Routes } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthLayout,
        children: [
            { path: 'login', component: LoginComponent, title: 'Iniciar Sesión | Facturación' },
            { path: 'register', component: RegisterComponent, title: 'Crear Cuenta | Facturación' },
            { path: 'forgot-password', component: LoginComponent }, // TODO: Implement Forgot Password
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    }
];
