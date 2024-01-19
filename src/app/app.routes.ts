import { Routes } from '@angular/router';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { CompleteSignUpComponent } from './components/auth/complete-sign-up/complete-sign-up.component';

export const routes: Routes = [
  { path: '', redirectTo: 'log-in', pathMatch: 'full' },
  {
    path: 'log-in',
    loadComponent: () =>
      import('./components/auth/log-in/log-in.component').then(
        (c) => c.LogInComponent
      ),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./components/auth/sign-up/sign-up.component').then(
        (c) => c.SignUpComponent
      ),
  },
  {
    path: 'complete-signUp',
    loadComponent: () =>
      import(
        './components/auth/complete-sign-up/complete-sign-up.component'
      ).then((c) => c.CompleteSignUpComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/pages/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/pages/settings/settings.component').then(
        (c) => c.SettingsComponent
      ),
  },
];
