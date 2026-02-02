import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs';
import {AuthService} from '../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService) {
  }

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
