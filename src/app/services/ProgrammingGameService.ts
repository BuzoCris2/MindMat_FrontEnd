import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgrammingGameService {
  private baseUrl: string = 'api/programminggame';

  constructor(private http: HttpClient) {}

  getObstacles(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/obstacles`);
  }

  executeCommand(command: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/execute`, { command });
  }
}
