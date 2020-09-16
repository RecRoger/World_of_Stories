import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationComponent } from 'src/app/users-login/containers/presentation/presentation.component';
import { LoginRoutingModule } from 'src/app/users-login/user-login-router.module';
import { UserLoginComponent } from './containers/user-login/user-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WriteOrReadComponent } from './components/write-or-read/write-or-read.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { UserContainerComponent } from './containers/user-container/user-container.component';
import { UserNavComponent } from './components/user-nav/user-nav.component';

@NgModule({
  declarations: [PresentationComponent, UserLoginComponent, WriteOrReadComponent, UserDataComponent, UserContainerComponent, UserNavComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsersLoginModule { }
