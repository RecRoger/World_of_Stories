import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../../../client/src/app/pages/users-login/users-login.module').then(m => m.UsersLoginModule),
  },
  {
    path: 'writers',
    loadChildren: () => import('../../../client/src/app/pages/writers/writers.module').then(m => m.WritersModule),
  },
  {
    path: 'readers',
    loadChildren: () => import('../../../client/src/app/pages/readers/readers.module').then(m => m.ReadersModule),
  },
  // { path: 'message', component: MessageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
