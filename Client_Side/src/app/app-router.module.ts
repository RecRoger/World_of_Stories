import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/users-login/users-login.module').then(m => m.UsersLoginModule),
  },
  {
    path: 'writers',
    loadChildren: () => import('../app/writers/writers.module').then(m => m.WritersModule),
  },
  {
    path: 'readers',
    loadChildren: () => import('../app/readers/readers.module').then(m => m.ReadersModule),
  },
  // { path: 'message', component: MessageComponent}
];

@NgModule({
imports: [RouterModule.forRoot(routes, {
  useHash: true
})],
exports: [RouterModule]
})
export class AppRoutingModule {}
