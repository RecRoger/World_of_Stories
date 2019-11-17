import { PresentationComponent } from 'src/app/users-login/containers/presentation/presentation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserLoginComponent } from './containers/user-login/user-login.component';
import { WriteOrReadComponent } from './containers/write-or-read/write-or-read.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full',
    component: PresentationComponent,
  },
  {
    path: 'user-login',
    component: UserLoginComponent
  },
  {
    path: 'write-or-read',
    component: WriteOrReadComponent
  }
  // { path: 'message', component: MessageComponent}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class LoginRoutingModule {}
