import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'write-or-read',
    pathMatch: 'full'
  },
  {
    path: 'write-or-read', pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => import('./components/write-or-read/write-or-read.component').then(c => c.WriteOrReadComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./components/user-data/user-data.component').then(c => c.UserDataComponent)
  },

];
