import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './pages/auth/auth-layout/auth-layout.component';
import { MainComponent } from './pages/auth/main/main.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { GamesComponent } from './pages/games/games.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProductsComponent } from './pages/products/products.component';

import { KeyboardComponent } from './pages/keyboard/keyboard/keyboard.component';

import { ReportsComponent } from './pages/reports/reports.component';


export const routes: Routes = [

  {
    path: '',
    component: AuthLayoutComponent,  // Usar el contenedor común para autenticación
    canActivate: [GuestGuard],
    children: [
      {
        path: '',
        redirectTo: 'main', // Redirigir a 'main' dentro del contenedor de autenticación
        pathMatch: 'full',
      },
      {
        path: 'main',
        component: MainComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SigUpComponent,
      },
    ],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin
          ],
          name: 'Users',
          showInSidebar: true
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Dashboard',
          showInSidebar: true
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'profile',
          showInSidebar: false
        }
      },
      {
        path: 'games',
        component: GamesComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'games',
          showInSidebar: true
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: { 
          authorities: [
            IRoleType.admin
          ],
          name: 'orders',
          showInSidebar: true
        }
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: { 
          authorities: [
            IRoleType.admin
          ],
          name: 'categories',
          showInSidebar: true
        }
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: { 
          authorities: [
            IRoleType.admin
          ],
          name: 'products',
          showInSidebar: true
        }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'reports',
          showInSidebar: true
        }
      },
      {
        path: 'keyboard',
        component: KeyboardComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'keyboard',
          showInSidebar: true
        }
      }
    ],
  },
];
