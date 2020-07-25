import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterialModule } from 'src/app/shared/material.module';
import { MessagesComponent } from './components/messages/messages.component';
import { WriteFragmentsComponent } from './components/write-fragments/write-fragments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WriteDecisionComponent } from './components/write-decision/write-decision.component';
import { AnimatedFragmentComponent } from './components/animated-fragment/animated-fragment.component';
import {TeximateModule} from 'ngx-teximate';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TakeDecisionComponent } from './components/take-decision/take-decision.component';


@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TeximateModule
  ],
  declarations: [
    LoaderComponent,
    HeaderComponent,
    MessagesComponent,
    WriteFragmentsComponent,
    WriteDecisionComponent,
    AnimatedFragmentComponent,
    TakeDecisionComponent
  ],
  exports: [
    LoaderComponent,
    HeaderComponent,
    AngularMaterialModule,
    MessagesComponent,
    WriteFragmentsComponent,
    WriteDecisionComponent,
    AnimatedFragmentComponent,
    TeximateModule,
    TakeDecisionComponent
  ]
})
export class SharedModule { }
