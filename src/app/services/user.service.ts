import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
  private userListSignal = signal<IUser[]>([]);
  
  public search: ISearch = { 
    page: 1,
    size: 5
  }
  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.userListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  getAllTeachers(): void {
    this.http.get<IUser[]>('users/teachers').subscribe({
      next: (users) => {
        console.log('Usuarios obtenidos desde el backend:', users);
        this.userListSignal.set(users); // Actualiza el signal con los usuarios obtenidos
      },
      error: (error) => {
        console.error('Error al obtener docentes:', error);
      },
    });
  }
  
  users$(): IUser[] {
    return this.userListSignal(); // Retorna directamente los datos del Signal
  }
  

  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(user: IUser) {
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(user: IUser) {
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  updateActiveStatus(userId: number, active: number) {
    this.editCustomSource(`${userId}/active`, { active }).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert(
          'success',
          response.message || 'User active status updated successfully',
          'center',
          'top',
          ['success-snackbar']
        );
        this.getAll(); // Actualiza la lista después de cambiar el estado
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          'error',
          'An error occurred updating the user active status',
          'center',
          'top',
          ['error-snackbar']
        );
        console.error('error', err);
      }
    });
  }

  getLoggedInUser(): Observable<IUser> {
    return this.http.get<IUser>('api/users/current');
}
}
