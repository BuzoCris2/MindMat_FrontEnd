import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public user?: IUser ;
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
      
      // Configuración de botones según el rol del usuario
      if (this.user?.role?.id === 1) {
        // Estudiante
        this.buttons = [
          { label: 'Juegos', route: '/app/user-dashboard', icon: 'assets/img/topbar/Icono-juegos.png', color: 'primary' },
          { label: 'Logros', route: '/app/achievements', icon: '', color: 'secondary' },
          { label: 'Perfil', route: '/app/profile', icon: '', color: 'tertiary' },
        ];
      } else if (this.user?.role?.id === 2) {
        // Docente
        this.buttons = [
          { label: 'Equipos', route: '/app/teams', icon: '', color: 'primary' },
          { label: 'Perfil', route: '/app/profile', icon: '', color: 'tertiary' },
        ];
      } else if (this.user?.role?.id === 3) {
        // Admin
        this.buttons = [
          { label: 'Usuarios', route: '/app/users', icon: '', color: 'primary' },
          { label: 'Equipos', route: '/app/teams', icon: '', color: 'secondary' },
          { label: 'Perfil', route: '/app/profile', icon: '', color: 'tertiary' },
        ];
      }
    });
  }
  

  /**
   * Navega a la ruta proporcionada
   * @param route Ruta de destino
   */
  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
