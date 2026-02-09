import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {configuration} from '../../config/configuration';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(localStorage.getItem(configuration.KEY_TOKEN));

  // BehaviorSubject almacena el token y permite a otros componentes reaccionar cuando cambia.
  constructor(private http: HttpClient, private router: Router) {
  }

  /**
   * Método para autenticar al usuario.
   * @param username - Nombre de usuario ingresado.
   * @param password - Contraseña ingresada.
   * @returns Observable que emite un objeto con el token de autenticación si la solicitud
   es exitosa.
   */
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/v1/authenticate`,
      {username, password},
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    );
  }

  /**
   * Almacena el token de autenticación en el BehaviorSubject.
   * @param token - Token recibido tras una autenticación exitosa.
   */
  setToken(token: string): void {
    localStorage.setItem(configuration.KEY_TOKEN, token);
    this.token.next(token); // Actualiza el valor del token.
  }

  /**
   * Obtiene el token actual almacenado en el BehaviorSubject.
   * @returns El token actual o null si no está definido.
   */
  getToken(): string | null {
    return localStorage.getItem(configuration.KEY_TOKEN);
  }

  /**
   * Devuelve un observable que emite el estado de autenticación basado en la existencia del token.
   * @returns Observable<boolean>
   */
  isLoggedIn(): Observable<boolean> {
    // Verifica si el token existe y emite un valor booleano.
    return this.token.asObservable().pipe(map((token: string | null) => !!token));
  }

  /**
   * Método para cerrar la sesión del usuario.
   * Elimina el token y redirige al usuario a la página de inicio de sesión.
   */
  logout(): void {
    localStorage.removeItem(configuration.KEY_TOKEN);
    this.token.next(null); // Limpia el token almacenado.
    this.router.navigate(['/']); // Redirige al usuario a la ruta raíz.
  }

  /**
   * Decodifica el token y devuelve la información del usuario.
   */
  getUserDetails(): any {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return {
          firstName: decoded.firstName, // Campo añadido en JwtUtil.java
          lastName: decoded.lastName,   // Campo añadido en JwtUtil.java
          username: decoded.sub,
          roles: decoded.roles
        };
      } catch (error) {
        console.error("Error decodificando el token", error);
        return null;
      }
    }
    return null;
  }

  /**
   * Método de utilidad para obtener solo el nombre completo.
   */
  getFullName(): string {
    const user = this.getUserDetails();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }
}
