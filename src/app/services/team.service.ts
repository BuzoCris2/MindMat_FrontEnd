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
        console.log('Paso 6: Respuesta del backend en getAll():', response);
        if (Array.isArray(response)) {
          console.log('Paso 7: Respuesta procesada como array:', response);
          this.teamListSignal.set(response);
        } else if (response.data) {
          console.log('Paso 8: Respuesta procesada como data (paginación):', response.data);
          this.teamListSignal.set(response.data);
        } else {
          console.error('Paso 9: Formato inesperado de la respuesta:', response);
          this.teamListSignal.set([]);
        }
      })
    );
  }
  
  
  /*getAllByUser(): Observable<ITeam[]> {
    return this.findAllWithParamsAndCustomSource(
      `byTeacher/${this.authService.getUser()?.id}`,
      { page: this.search.page, size: this.search.size }
    ).pipe(
      tap((response: any) => {
        if (Array.isArray(response)) {
          this.teamListSignal.set(response); // Actualiza el signal.
        } else if (response.data) {
          this.teamListSignal.set(response.data);
        }
      })
    );
  } */

    getAllByUser(): Observable<ITeam[]> {
      const userId = this.authService.getUser()?.id;
      const url = `teams/byTeacher`; // URL relativa
      return this.http.get<ITeam[]>(url).pipe(
        tap((response) => {
          console.log('Respuesta del backend:', response); // Debug
          this.teamListSignal.set(response); // Actualiza la señal con la respuesta
        })
      );
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

  /*save(team: ITeam) {
    this.add(team).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAllByUser();
        console.log(response);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('Error:', err);
      },
    });
  }
  

  update(team: ITeam): Observable<any> {
    return this.editCustomSource(`${team.id}`, team); // Devuelve el observable aquí
  } */

    save(team: ITeam): Observable<any> {
      return this.add(team); // Método existente para POST
  }
  
  update(team: ITeam): Observable<any> {
      return this.editCustomSource(`${team.id}`, team); // Método existente para PUT
  }
  

  public updateTeamField(field: string, newValue: string): Observable<IResponse<ITeam>> {
    const data = { [field]: newValue };
    return this.http.patch<IResponse<ITeam>>(`${this.source}`, data);
    
  }

  deleteTeam(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.source}/${teamId}`);
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