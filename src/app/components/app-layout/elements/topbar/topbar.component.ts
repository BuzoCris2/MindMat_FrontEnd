import { Component, OnInit } from '@angular/core';
import { Router, RouterLink  } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { ProfileService } from '../../../../services/profile.service';
import { IUser } from '../../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [CommonModule, RouterLink],  
  standalone: true,
  
})
export class TopbarComponent implements OnInit {
  public user?: IUser;

  constructor(
    public router: Router,
    public authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    // Suscríbete a cambios en el perfil
    this.profileService.user$.subscribe(updatedUser => {
      if (updatedUser) {
        this.user = updatedUser;
      }
    });
  }
  public shouldDisplayRoute(route: 'user-dashboard' | 'colorgame' | 'keyboard' | 'mathleship'|'dashboard'|'grow-your-tree'): boolean {
    const routesAvailableForUser = {
      'user-dashboard': true,
      'colorgame': true,
      'keyboard': true,
      'mathleship':true,
      'dashboard': true,
      'grow-your-tree': true,
      //'colorgame': this.authService.hasRole('user'),
      //'keyboard': this.authService.hasRole('admin') || this.authService.hasRole('superAdmin'),
      //'mathleship': this.authService.hasRole('user') || this.authService.hasRole('admin'),
    };
    return routesAvailableForUser[route];
  }
  

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
