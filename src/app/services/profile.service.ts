import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser, IResponse } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = 'users/me';
  private userSubject = new BehaviorSubject<IUser | null>(null);
  private snackBar = inject(MatSnackBar);
  private alertSubject = new BehaviorSubject<{ type: 'time' | 'error' | 'success'; title: string; message: string; buttonText:string } | null>(null);

  get user$() {
    return this.userSubject.asObservable();
  }

  get alert$() {
    return this.alertSubject.asObservable();
  }

  getUserInfoSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        this.userSubject.next(response); 
        console.log("Datos del usuario logueado:", response);
      },
      error: (error: any) => {
        this.alertSubject.next({
          type: 'error',
          title: 'Error',
          message: `Error al traer usuarios: ${error.message}`,
          buttonText: 'Error',
        });
      }
    });
  }

  isStudent(): boolean {
    return this.userSubject.value?.role?.id === 1;
  }

  isTeacher(): boolean {
    return this.userSubject.value?.role?.id === 2;
  }

  public updateUserField(field: string, newValue: string): Observable<IResponse<IUser>> {
    const data = { [field]: newValue };
    return this.http.patch<IResponse<IUser>>(`${this.source}`, data);
    
  }
  
  
}
