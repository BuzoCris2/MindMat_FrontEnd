import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IResponse, ISearch, ITeam } from '../interfaces';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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

  getAll(): Observable<ITeam[]> {
    return this.findAllWithParams({ page: this.search.page, size: this.search.size }).pipe(
        tap((response: any) => {
            if (Array.isArray(response)) {
                this.teamListSignal.set(response);
            } else if (response.data) {
                this.teamListSignal.set(response.data);
            } else {
                console.error('Formato inesperado en la respuesta del backend', response);
                this.teamListSignal.set([]);
            }
        })
    );
  }
  
    getAllByUser(): Observable<ITeam[]> {
      const userId = this.authService.getUser()?.id;
      const url = `teams/byTeacher`; // URL relativa
      return this.http.get<ITeam[]>(url).pipe(
        tap((response) => {
          this.teamListSignal.set(response); // Actualiza la señal con la respuesta
        })
      );
    }
    
       
  
  
  getCountByTeacher() {
    this.findAllWithParamsAndCustomSource(`countByTeacher/${this.authService.getUser()?.id}`, { page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        // Ajustar asignación según el formato
        if (Array.isArray(response)) {
          this.teamListSignal.set(response); // Si la respuesta es un arreglo directo
        } else if (response.data) {
          this.teamListSignal.set(response.data); // Si la respuesta tiene una propiedad `data`
        } else {
          this.teamListSignal.set([]); // Si la respuesta no es válida, se asegura de que el signal no quede con undefined
        }
        },
      error: (err: any) => {
         this.teamListSignal.set([]); // Asegurarse de que no quede undefined si hay error
      }
    });
  }

  save(team: ITeam) {
    this.add(team).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAllByUser();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('Error:', err);
      },
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