import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { MainRoutes } from '@core/models/constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: MainRoutes.WELCOME,
    pathMatch: 'full'
  },
  {
    path: MainRoutes.WELCOME, pathMatch: 'full',
    loadComponent: () => import('./pages/presentation/presentation.component').then(c => c.PresentationComponent)
  },
  {
    path: MainRoutes.LOGIN,
    loadComponent: () => import('./pages/user/components/user-login/user-login.component').then(c => c.UserLoginComponent)
  },
  {
    path: MainRoutes.USER,
    loadChildren: () => import('./pages/user/user.routes').then(m => m.USER_ROUTES)
  },

  // Módulo Writers (Escritores/Creadores)
  {
    path: MainRoutes.WRITERS,
    canActivate: [authGuard],
    loadChildren: () => import('./pages/writers/writers.routes').then(m => m.WRITERS_ROUTES)
    // Acá más adelante podés clavarle un Guard: canActivate: [AuthGuard]
  },

  // // Módulo Readers (Lectores)
  // {
  //   path: 'readers',
  //   loadChildren: () => import('./modules/readers/readers.routes').then(m => m.READERS_ROUTES)
  // },

  // Ruta comodín para el 404
  // {
  //   path: '**',
  //   redirectTo: 'welcome'
  // }

];
