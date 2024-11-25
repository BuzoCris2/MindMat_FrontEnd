import { ModalService } from './modal.service';
import { ModalComponent } from '../components/modal/modal.component';
import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IScore } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService extends BaseService<IScore> {
    protected override source: string = 'score';
    private scoreListSignal = signal<IScore[]>([]);
    get scores$() {
        return this.scoreListSignal;
    }
    public totalItems: any = [];
    private authService: AuthService = inject(AuthService);
    private alertService: AlertService = inject(AlertService);
    private modalService: ModalService = inject(ModalService);
//insert modal as a parameter, it could work
save(score: IScore): Observable<any> {
    console.log(score);
    const observable = this.add(score).pipe(
        tap((response: any) => {

        }),
        catchError((err: any) => {
            // Mostrar alerta de error
            this.alertService.displayAlert(
                'error',
                'An error occurred adding the score',
                'center',
                'top',
                ['error-snackbar']
            );
            console.error('error', err);
            return throwError(() => err); // Propagar el error
        })
    );

    return observable; // Retornar el observable
}
}