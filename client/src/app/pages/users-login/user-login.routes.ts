import { Routes } from '@angular/router';

export const USER_LOGIN_ROUTES: Routes = [
  {
    path: '', pathMatch: 'full',
    loadComponent: () => import('./containers/presentation/presentation.component').then(c => c.PresentationComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./containers/user-login/user-login.component').then(c => c.UserLoginComponent)
  },
  // {
  //   path: 'user',
  //   component: UserContainerComponent,
  //   children: [
  //     {
  //       path: 'write-or-read',
  //       component: WriteOrReadComponent
  //     },
  //     {
  //       path: 'settings',
  //       component: UserDataComponent
  //     }
  //   ]
  // },
];
