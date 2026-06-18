import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../client/src/app/components/header/header.component';
import { AngularMaterials } from 'src/app/utils/material-modules';
import { MessagesComponent } from '../../../../client/src/app/components/messages/messages.component';
import { WriteFragmentsComponent } from '../components/write-fragments/write-fragments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WriteDecisionComponent } from '../components/write-decision/write-decision.component';
import { AnimatedFragmentComponent } from '../components/animated-fragment/animated-fragment.component';
import { TeximateModule } from 'ngx-teximate';
import { TakeDecisionComponent } from '../components/take-decision/take-decision.component';
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

