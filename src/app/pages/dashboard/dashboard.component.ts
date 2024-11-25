import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/dashboard/button/button.component';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public user?: IUser;
  public buttons: { label: string; route: string; icon?: string; color: string }[] = [];

  constructor(private profileService: ProfileService, private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.profileService.user$.subscribe((userData) => {
      this.user = this.authService.getUser();

      this.profileService.user$.subscribe((updatedUser) => {
        if (updatedUser) {
          this.user = updatedUser;
        }
      });

      const permittedRoutes = this.authService.getPermittedRoutes(routes[3].children || []);
      const filteredRoutes = permittedRoutes.filter(route => route.data?.showInDashboard);
      // Genera los botones dinámicamente basados en las rutas permitidas
      this.buttons = filteredRoutes.map((route) => ({
        label: route.data?.name || 'Ruta',
        route: `/app/${route.path}`, 
        icon: route.data?.icon || '', 
        color: this.getButtonColor(route.data?.name),
      }));
    });
  }

  // Método para navegar
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
    this.router.navigateByUrl(route).catch((err) => {
      console.error('Error navegando a la ruta:', route, err);
    });
  }

  // Método para asignar colores dinámicamente
  private getButtonColor(name: string | undefined): string {
    const colorMap: { [key: string]: string } = {

      Logros: 'tertiary',
      Perfil: 'secondary',
      Equipos: 'tertiary',
      Usuarios: 'tertiary', 
      'Panel de Juegos': 'primary',
      reports: 'primary',
    };
    return colorMap[name || ''] || 'primary'; // Color por defecto: primary
  }
}
