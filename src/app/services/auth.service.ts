import { inject, Injectable } from '@angular/core';
import { IAuthority, ILoginResponse, IResponse, IRoleType, IUser } from '../interfaces';
import { Observable, firstValueFrom, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken!: string;
  private expiresIn! : number;
  private user: IUser = {email: '', authorities: []};
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  constructor() {
    this.load();
  }


  public save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));

    if (this.accessToken)
      localStorage.setItem('access_token', JSON.stringify(this.accessToken));

    if (this.expiresIn)
      localStorage.setItem('expiresIn',JSON.stringify(this.expiresIn));
  }

  private load(): void {
    let token = localStorage.getItem('access_token');
    if (token) this.accessToken = token;
    let exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);
    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  public getUser(): IUser | undefined {
    return this.user;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public check(): boolean {
    if (!this.accessToken){
      return false;
    } else {
      return true;
    }
  }

  public login(credentials: {
    email: string;
    password: string;
  }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response: any) => {
        this.accessToken = response.token;
        this.user.email = credentials.email;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.save();
      })
    );
  }

  public hasRole(role: string): boolean {
    return this.user.authorities ?  this.user?.authorities.some(authority => authority.authority == role) : false;
  }

  public isSuperAdmin(): boolean {
    return this.user.authorities ?  this.user?.authorities.some(authority => authority.authority == IRoleType.superAdmin) : false;
  }

  public hasAnyRole(roles: any[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  public getPermittedRoutes(routes: any[]): any[] {
    let permittedRoutes: any[] = [];
    for (const route of routes) {
      if(route.data && route.data.authorities) {
        if (this.hasAnyRole(route.data.authorities)) {
          permittedRoutes.unshift(route);
        } 
      }
    }
    return permittedRoutes;
  }


  public logout() {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

  public getUserAuthorities (): IAuthority[] | undefined {
    return this.getUser()?.authorities ? this.getUser()?.authorities : [];
  }

  public areActionsAvailable(routeAuthorities: string[]): boolean  {
    // definición de las variables de validación
    let allowedUser: boolean = false;
    let isAdmin: boolean = false;
    // se obtienen los permisos del usuario
    let userAuthorities = this.getUserAuthorities();
    // se valida que sea una ruta permitida para el usuario
    for (const authority of routeAuthorities) {
      if (userAuthorities?.some(item => item.authority == authority) ) {
        allowedUser = userAuthorities?.some(item => item.authority == authority)
      }
      if (allowedUser) break;
    }
    // se valida que el usuario tenga un rol de administración
    if (userAuthorities?.some(item => item.authority == IRoleType.admin || item.authority == IRoleType.superAdmin)) {
      isAdmin = userAuthorities?.some(item => item.authority == IRoleType.admin || item.authority == IRoleType.superAdmin);
    }          
    return allowedUser && isAdmin;
  }
  
  public requestPasswordReset(email: string): Observable<any> {
    return this.http.post('auth/request-password-reset', { email }, { observe: 'response', responseType: 'text'  });
  }

  public resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post('auth/reset-password', { token, newPassword }, { responseType: 'text' });
  }
  public checkEmailExists(email: string): Observable<boolean> {
    return this.http.get('/auth/check-email', { params: { email }, observe: 'response' })
      .pipe(
        map(response => false), // Correo disponible
        catchError((err) => {
          if (err.status === 409) {
            return of(true); // Correo ya utilizado
          }
          return of(false); // Otros errores se interpretan como "correo disponible"
        })
      );
  }

  public signup(user: IUser): Observable<ILoginResponse> {
  return this.http.post<ILoginResponse>('/auth/signup', user).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 409) {
        // Devuelve un error específico para capturarlo en el componente
        return throwError(() => new Error('Correo ya utilizado'));
      }
      // Otro mensaje para cualquier error diferente al conflicto
      return throwError(() => new Error('Ocurrió un error en el registro. Por favor, intenta nuevamente.'));
    })
  );
}

}
