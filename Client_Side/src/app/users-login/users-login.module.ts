import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationComponent } from 'src/app/users-login/containers/presentation/presentation.component';
import { LoginRoutingModule } from 'src/app/users-login/user-login-router.module';
import { UserLoginComponent } from './containers/user-login/user-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WriteOrReadComponent } from './containers/write-or-read/write-or-read.component';

@NgModule({
  declarations: [PresentationComponent, UserLoginComponent, WriteOrReadComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UsersLoginModule { }
