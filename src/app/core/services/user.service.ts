import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  fetchUsers(): Observable<any> {
    const token = this.authService.getToken(); // Obtén el token del AuthService
    if (!token) {
      // Si no hay token, lanza un error indicando que el usuario no está autorizado.
      return throwError(() => new Error('Unauthorized'));
    }

    // Realiza la solicitud GET al endpoint de regiones con el token en el encabezado.
    return this.http.get(`${environment.apiUrl}/users`, {
      headers: new HttpHeaders({Authorization: `Bearer ${token}`})
    });
  }
}
