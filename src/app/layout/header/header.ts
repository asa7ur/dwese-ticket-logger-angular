import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs';
import {AuthService} from '../../core/services/auth.service';

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
  isLoggedIn: boolean = false;
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
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
