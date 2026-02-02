import {Routes} from '@angular/router';
import {Home} from './features/home/home';
import {Login} from './features/login/login';
import {Regions} from './features/regions/regions';
import {Forbidden} from './features/forbidden/forbidden';
import {Error404} from './features/error404/error404';
import {authGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'regions',
    component: Regions,
    canActivate: [authGuard],
  },
  {
    path: 'forbidden',
    component: Forbidden,
  },
  {
    path: "**",
    component: Error404,
  }
];
