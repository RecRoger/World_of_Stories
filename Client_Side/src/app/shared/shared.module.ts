import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterials } from 'src/app/shared/material-modules';
import { MessagesComponent } from './components/messages/messages.component';
import { WriteFragmentsComponent } from './components/write-fragments/write-fragments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WriteDecisionComponent } from './components/write-decision/write-decision.component';
import { AnimatedFragmentComponent } from './components/animated-fragment/animated-fragment.component';
import { TeximateModule } from 'ngx-teximate';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TakeDecisionComponent } from './components/take-decision/take-decision.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CityNamePipe } from './pipes/city-name.pipe';
import { PlaceNamePipe } from './pipes/place-name.pipe';
import { GetRandomPipe } from './pipes/get-random.pipe';
import { AutosizeModule } from 'ngx-autosize';

export const SharedCommons = [
    CommonModule,
    ...AngularMaterials,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TeximateModule,
    AutosizeModule,
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
]

