import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },

  // Módulo Users (Carga perezosa de sus rutas internas)
  {
    path: 'users',
    loadChildren: () => import('./pages/users-login/user-login.routes').then(m => m.USER_LOGIN_ROUTES)
  },

  // Módulo Writers (Escritores/Creadores)
  // {
  //   path: 'writers',
  //   loadChildren: () => import('./modules/writers/writers.routes').then(m => m.WRITERS_ROUTES)
  //   // Acá más adelante podés clavarle un Guard: canActivate: [AuthGuard]
  // },

  // // Módulo Readers (Lectores)
  // {
  //   path: 'readers',
  //   loadChildren: () => import('./modules/readers/readers.routes').then(m => m.READERS_ROUTES)
  // },

  // Ruta comodín para el 404
  {
    path: '**',
    redirectTo: 'users'
  }

];
