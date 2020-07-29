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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CityNamePipe } from './pipes/city-name.pipe';
import { PlaceNamePipe } from './pipes/place-name.pipe';
import { GetRandomPipe } from './pipes/get-random.pipe';


@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FontAwesomeModule,
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
    TakeDecisionComponent,
    CityNamePipe,
    PlaceNamePipe,
    GetRandomPipe
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
    FontAwesomeModule,
    TakeDecisionComponent,
    CityNamePipe,
    PlaceNamePipe,
    GetRandomPipe
  ]
})
export class SharedModule { }
