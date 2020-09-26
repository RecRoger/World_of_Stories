import { PresentationComponent } from 'src/app/users-login/containers/presentation/presentation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserLoginComponent } from './containers/user-login/user-login.component';
import { WriteOrReadComponent } from './components/write-or-read/write-or-read.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { UserContainerComponent } from './containers/user-container/user-container.component';

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
    path: 'user',
    component: UserContainerComponent,
    children: [
      {
        path: 'write-or-read',
        component: WriteOrReadComponent
      },
      {
        path: 'settings',
        component: UserDataComponent
      }
    ]
  },
  // { path: 'message', component: MessageComponent}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class LoginRoutingModule {}
