import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterialModule } from 'src/app/shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  declarations: [LoaderComponent, HeaderComponent],
  exports: [LoaderComponent, HeaderComponent, AngularMaterialModule]
})
export class SharedModule { }
