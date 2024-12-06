import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';
import { IUserAchievement, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {

  constructor(private http: HttpClient) {}
  //protected override source: string = 'achievements';
  private achievementListSignal = signal<IUserAchievement[]>([]);  // Cambiado a IUserAchievement[]
  
  getAchievements(): Observable<any[]> {
    return this.http.get<any[]>('score/achievements');
  }

  public search: ISearch = { 
    page: 1,
    size: 5
  };
  
  public totalItems: any = [];
  
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);
}
