import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IResponse, ISearch, ITeam } from '../interfaces';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class TeamService extends BaseService<ITeam>{
  

  protected override source: string = 'teams';
  private teamListSignal = signal<ITeam[]>([]);
  get teams$() {
    return this.teamListSignal;
  }
  public search: ISearch = { 
    page: 1,
    size: 5
  }
  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
  
        // Ahora el backend devuelve un array directo, no un objeto con `data`.
        if (Array.isArray(response)) {
          this.teamListSignal.set(response); // Directamente asignamos la lista al signal.
        } else {
          console.warn('Formato inesperado de respuesta:', response);
          this.teamListSignal.set([]); // Si el formato no es válido, asegúrate de limpiar la lista.
        }
  
        console.log('Datos actualizados en teamListSignal:', this.teamListSignal());
      },
      error: (err: any) => {
        console.error('Error al obtener los datos:', err);
      },
    });
  }  
  
  getAllByUser() {
    this.findAllWithParamsAndCustomSource(
      `byTeacher/${this.authService.getUser()?.id}`,
      { page: this.search.page, size: this.search.size }
    ).subscribe({
      next: (response: any) => {
        // Verifica la respuesta y ajusta según el formato del backend
        if (Array.isArray(response)) {
          this.teamListSignal.set(response); // Si la respuesta es un array
        } else if (response.data) {
          this.teamListSignal.set(response.data); // Si viene dentro de "data"
        }
      },
      error: (err: any) => {
        console.error('Error al obtener los equipos:', err);
      },
    });
  }
  
  getCountByTeacher() {
    this.findAllWithParamsAndCustomSource(`countByTeacher/${this.authService.getUser()?.id}`, { page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('Respuesta de conteo:', response);
        
        // Ajustar asignación según el formato
        if (Array.isArray(response)) {
          this.teamListSignal.set(response); // Si la respuesta es un arreglo directo
        } else if (response.data) {
          this.teamListSignal.set(response.data); // Si la respuesta tiene una propiedad `data`
        } else {
          console.warn('Formato inesperado de respuesta:', response);
          this.teamListSignal.set([]); // Si la respuesta no es válida, se asegura de que el signal no quede con undefined
        }
        
        console.log('Datos actualizados en conteo de teamListSignal:', this.teamListSignal());
      },
      error: (err: any) => {
        console.error('Error al obtener los datos:', err);
        this.teamListSignal.set([]); // Asegurarse de que no quede undefined si hay error
      }
    });
  }

  save(team: ITeam) {
    this.add(team).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAllByUser();
        console.log (response)
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(team: ITeam) {
    this.editCustomSource(`${team.id}`, team).subscribe({
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

  public updateTeamField(field: string, newValue: string): Observable<IResponse<ITeam>> {
    const data = { [field]: newValue };
    return this.http.patch<IResponse<ITeam>>(`${this.source}`, data);
    
  }

  delete(team: ITeam) {
    this.delCustomSource(`${team.id}`).subscribe({
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

  addStudentToTeam(teamId: number, Id: number) {
    const payload = { id: Id };
    this.http.patch<IResponse<ITeam>>(`${this.source}/${teamId}/addStudent`, payload).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert(
          'success',
          response.message || 'Student added successfully',
          'center',
          'top',
          ['success-snackbar']
        );
        this.getAll(); // Refresca la lista de equipos
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          'error',
          err.error?.message || 'An error occurred adding the student',
          'center',
          'top',
          ['error-snackbar']
        );
        console.error('Error adding student:', err);
      }
    });
  }
  
  removeStudentFromTeam(teamId: number, studentId: number) {
    const payload = { id: studentId };
    this.http.patch<IResponse<ITeam>>(`${this.source}/${teamId}/removeStudent`, payload).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert(
          'success',
          response.message || 'Student removed successfully',
          'center',
          'top',
          ['success-snackbar']
        );
        this.getAll(); // Refresca la lista de equipos
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          'error',
          err.error?.message || 'An error occurred removing the student',
          'center',
          'top',
          ['error-snackbar']
        );
        console.error('Error removing student:', err);
      }
    });
  }
  
  
}