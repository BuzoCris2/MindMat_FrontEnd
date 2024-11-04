import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IShip } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MathleshipService {
  private baseUrl: string = 'api/mathleship';
  private boardSignal = signal<string[][]>([]);

  constructor(private http: HttpClient) {}

  initializeBoard(): Observable<IShip[]> {
    return this.http.get<IShip[]>(`${this.baseUrl}/initialize`);
  }

  attackCell(row: number, column: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/attack`, { row, column });
  }

  get board$() {
    return this.boardSignal;
  }
}
