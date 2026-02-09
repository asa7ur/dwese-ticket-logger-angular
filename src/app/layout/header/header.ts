import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs';
import {AuthService} from '../../core/services/auth';
import {UserDTO} from '../../models/types';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  authService = inject(AuthService);
  userService = inject(UserService);
  isLoggedIn: boolean = false;
  user: UserDTO = new UserDTO();
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.userService.fetchUser().subscribe((res: UserDTO) => {
      console.log(res);
      this.user = res;
    })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
