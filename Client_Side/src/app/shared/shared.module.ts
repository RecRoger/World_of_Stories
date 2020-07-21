import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterialModule } from 'src/app/shared/material.module';
import { MessagesComponent } from './components/messages/messages.component';
import { WriteFragmentsComponent } from './components/write-fragments/write-fragments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WriteDecisionComponent } from './components/write-decision/write-decision.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LoaderComponent, HeaderComponent, MessagesComponent, WriteFragmentsComponent, WriteDecisionComponent],
  exports: [LoaderComponent, HeaderComponent, AngularMaterialModule, MessagesComponent, WriteFragmentsComponent, WriteDecisionComponent]
})
export class SharedModule { }
