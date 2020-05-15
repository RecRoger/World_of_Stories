import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterialModule } from 'src/app/shared/material.module';
import { MessagesComponent } from './components/messages/messages.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
  ],
  declarations: [LoaderComponent, HeaderComponent, MessagesComponent],
  exports: [LoaderComponent, HeaderComponent, AngularMaterialModule, MessagesComponent]
})
export class SharedModule { }
