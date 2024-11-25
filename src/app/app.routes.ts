import { MathleshipComponent } from './pages/mathleship/mathleship.component';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/auth/auth-layout/auth-layout.component';
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
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { GrowYourTreeComponent } from './pages/grow-your-tree/grow-your-tree.component';
import { KeyboardComponent } from './pages/keyboard/keyboard/keyboard.component';

import { ReportsComponent } from './pages/reports/reports.component';
import { ColorGamePageComponent } from './pages/color-game/color-game.component';

import { UserDashboardComponent } from './pages/game-panel/user-dashboard.component';
import { TeamsComponent } from './pages/teams/teams.component';

//export const routes: Routes = [

export const routes: Routes = [  
  {
    path: '',
    component: AuthLayoutComponent,  
    canActivate: [GuestGuard],
    children: [
      {
        path: '',
        redirectTo: 'main', 
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
      {
        path: 'forgot-password', 
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password', 
        component: ResetPasswordComponent,
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
          name: 'Usuarios',
          showInDashboard: true,
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
          showInDashboard: false,
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
          name: 'Perfil',
          showInDashboard: true,
          icon:'assets/img/dashboard/perfil.png',
        }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: { 
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
          ],
          name: 'Reportes',
          showInDashboard: true,
        }
      },
      {
        path: 'keyboard',
        component: KeyboardComponent,
        data: { 
          authorities: [
            IRoleType.user,
          ],
          name: 'keyboard',
          showInDashboard: false,
        }
      },
      {
        path: 'mathleship',
        component: MathleshipComponent,
        data: { 
          authorities: [
            IRoleType.user,
          ],
          name: 'mathleship',
          showInDashboard: false,
        }
      },
      {
        path: 'user-dashboard',
        component: UserDashboardComponent,
        canActivate: [AuthGuard], 
        data: { 
          authorities: [IRoleType.user], 
          name: 'Panel de Juegos',
          showInDashboard: true,
          icon:'assets/img/dashboard/juegos.png',
        }
      },
      {
        path: 'grow-your-tree',
        component: GrowYourTreeComponent,
        data: { 
          authorities: [
            IRoleType.user
          ],
          name: 'Arbol',
          showInDashboard: false,
        }
      },
      {
        path: 'colorgame',
        component: ColorGamePageComponent,
        data: {
          authorities: [
            IRoleType.user,
          ],
          name: 'color game',
          showInDashboard: false,
        }
      },
      {
        path: 'teams',
        component: TeamsComponent,
        data: {
          authorities: [
            IRoleType.admin, 
            IRoleType.superAdmin,
          ],
          name: 'Equipos',
          showInDashboard: true,
          icon:'assets/img/dashboard/team.png',
        }
      }      
    ],
  },
];
