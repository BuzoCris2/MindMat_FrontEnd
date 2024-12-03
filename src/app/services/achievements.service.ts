import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUserAchievement, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService extends BaseService<IUserAchievement> {  // Cambiado a IUserAchievement
  protected override source: string = 'achievements';
  private achievementListSignal = signal<IUserAchievement[]>([]);  // Cambiado a IUserAchievement[]
  
  get achievements$() {
    return this.achievementListSignal;
  }

  public search: ISearch = { 
    page: 1,
    size: 5
  };
  
  public totalItems: any = [];
  
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  // Obtener todos los logros
  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        
        // Mapear la respuesta para convertirla en el formato adecuado
        const userAchievements: IUserAchievement[] = response.data.map((achievement: any) => ({
          id: achievement.id,
          user: achievement.user,  // Asegúrate de que la API te esté proporcionando esta información
          achievement: achievement.achievement,  // Lo mismo aquí
          achievedAt: achievement.achievedAt
        }));
        
        this.achievementListSignal.set(userAchievements);
      },
      error: (err: any) => {
        console.error('Error', err);
      }
    });
  }

  // Obtener logros de un usuario específico
  getAllByUser() {
    this.findAllWithParamsAndCustomSource(`${this.authService.getUser()?.id}`, { page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        
        // Mapear la respuesta para convertirla en el formato adecuado
        const userAchievements: IUserAchievement[] = response.data.map((achievement: any) => ({
          id: achievement.id,
          user: achievement.user,  // Asegúrate de que la API te esté proporcionando esta información
          achievement: achievement.achievement,  // Lo mismo aquí
          achievedAt: achievement.achievedAt
        }));
        
        this.achievementListSignal.set(userAchievements);
      },
      error: (err: any) => {
        console.error('Error', err);
      }
    });
  }

  // Guardar un nuevo logro para el usuario
  save(achievement: IUserAchievement) {  // Cambiado a IUserAchievement
    const userId = this.authService.getUser()?.id;  // Obtener el ID del usuario
    this.addCustomSource(`users/${this.authService.getUser()?.id}/achievements`, achievement).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAllByUser();  // Actualizar logros del usuario
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the achievement', 'center', 'top', ['error-snackbar']);
        console.error('Error', err);
      }
    });
  }

  // Actualizar un logro del usuario
  update(achievement: IUserAchievement) {  // Cambiado a IUserAchievement
    const userId = this.authService.getUser()?.id;
    this.editCustomSource(`users/${this.authService.getUser()?.id}/achievements/${achievement.id}`, achievement).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAllByUser();  // Actualizar logros del usuario
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the achievement', 'center', 'top', ['error-snackbar']);
        console.error('Error', err);
      }
    });
  }

  // Eliminar un logro del usuario
  delete(achievement: IUserAchievement) {  // Cambiado a IUserAchievement
    const userId = this.authService.getUser()?.id;
    this.delCustomSource(`users/${this.authService.getUser()?.id}/achievements/${achievement.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAllByUser();  // Actualizar logros del usuario
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the achievement', 'center', 'top', ['error-snackbar']);
        console.error('Error', err);
      }
    });
  }
}
