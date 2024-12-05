import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

  attackCell(row: number, column: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/attack`, { row, column });
  }

  getShips(): Observable<IShip[]> {
    return this.http.get<IShip[]>(`${this.baseUrl}/initialize`);
  }
  
  
  get board$() {
    return this.boardSignal;
  }

  getGridData(): Observable<{ columns: string[]; rows: number[] }> {
    return of({
      columns: ['A', 'B', 'C', 'D', 'E', 'F'],
      rows: [1, 2, 3, 4, 5, 6],
    });
  }
  
}
