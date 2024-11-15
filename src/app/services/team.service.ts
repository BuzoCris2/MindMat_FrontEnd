import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, ITeam } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseService<ITeam>{

  protected override source: string = 'users';
  private userListSignal = signal<ITeam[]>([]);
  get users$() {
    return this.userListSignal;
  }
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
}
