import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../core/services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    username = '';
    password = '';
    error: string | null = null;

    constructor(private auth: AuthService, private router: Router){}

  onSubmit() {
      this.auth.login(this.username, this.password).subscribe({
        next: (res) => {
          this.auth.setToken(res.token);
          this.router.navigate(['/regions']);
        },
        error: (err) => {
          this.error = 'Usuario y contraseña inválido';
        }
      });
  }
}
