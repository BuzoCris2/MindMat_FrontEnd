import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ProfileService } from '../../../../services/profile.service';
import { IUser } from '../../../../interfaces';
import { routes } from '../../../../app.routes';
import { TopbarButtonComponent } from '../topbar-button/topbar-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [CommonModule, TopbarButtonComponent],
  standalone: true,
})
export class TopbarComponent implements OnInit {
  public user?: IUser;
  public buttons: { route: string; icon: string }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileService.user$.subscribe((userData) => {
    this.user = this.authService.getUser();

    // Suscribirse a los cambios del usuario
    this.profileService.user$.subscribe((updatedUser) => {
      if (updatedUser) {
        this.user = updatedUser;
      }
    });

    // Obtener las rutas permitidas y asignar botones dinámicos
    const permittedRoutes = this.authService.getPermittedRoutes(routes[3].children || []);
    const filteredRoutes = permittedRoutes.filter((route) => route.data?.topbarIcon);

    this.buttons = filteredRoutes.map((route) => ({
      route: `/app/${route.path}`,
      icon: route.data?.topbarIcon || '',
    }));
  });
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}