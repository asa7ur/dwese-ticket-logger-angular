import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {configuration} from '../../config/configuration';
import {NotificationService} from './notification.service';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(localStorage.getItem(configuration.KEY_TOKEN));
  private userName = new BehaviorSubject<string | null>(this.getNameFromToken(localStorage.getItem(configuration.KEY_TOKEN)));
  public userName$ = this.userName.asObservable();

  // BehaviorSubject almacena el token y permite a otros componentes reaccionar cuando cambia.
  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  // Función auxiliar para decodificar el token y extraer el nombre
  private getNameFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return `${payload.firstName} ${payload.lastName}`;
    } catch (e) {
      return null;
    }
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
    ).pipe(
      tap(response => {
        this.setToken(response.token);
        console.log('Login exitosom conectando a WebSockets...')

        this.notificationService.connect();
      })
    )
  }

  /**
   * Almacena el token de autenticación en el BehaviorSubject.
   * @param token - Token recibido tras una autenticación exitosa.
   */
  setToken(token: string): void {
    localStorage.setItem(configuration.KEY_TOKEN, token);
    this.token.next(token); // Actualiza el valor del token.
    this.userName.next(this.getNameFromToken(token));
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
    this.userName.next(null);
    this.notificationService.disconnect();
    this.router.navigate(['/']); // Redirige al usuario a la ruta raíz.
  }

  /**
   * Extrae el nombre de usuario desde el token JWT.
   * @returns Nombre de usuario o `null` si el token es inválido.
   */
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null; // `sub` es el campo estándar en JWT para el username.
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
    }
  }

}
