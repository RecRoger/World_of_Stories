import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadersComponent } from './readers.component';
import { ReadersRoutingModule } from './readers-router.module';
import { SharedModule } from '../shared/shared.module';
import { ReaderNavComponent } from './componentes/reader-nav/reader-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadersHomeComponent } from './componentes/readers-home/readers-home.component';
import { CitySelectorComponent, SelectCityComponent } from './componentes/select-city/select-city.component';
import { PlaceSelectorComponent, ReadCityComponent } from './componentes/read-city/read-city.component';
import { NpcSelectorComponent, ReadPlaceComponent } from './componentes/read-place/read-place.component';
import { ReadStoryContainerComponent } from './containers/read-story-container/read-story-container.component';
import { ReadNpcComponent } from './componentes/read-npc/read-npc.component';
import { ReadChaptersComponent } from './componentes/read-chapters/read-chapters.component';
import { StorySelectorComponent } from './componentes/story-selector/story-selector.component';



@NgModule({
  declarations: [
    ReadersComponent,
    ReaderNavComponent,
    ReadersHomeComponent,
    SelectCityComponent,
    CitySelectorComponent,
    ReadCityComponent,
    PlaceSelectorComponent,
    ReadPlaceComponent,
    ReadStoryContainerComponent,
    ReadNpcComponent,
    StorySelectorComponent,
    NpcSelectorComponent,
    ReadChaptersComponent
  ],
  imports: [
    CommonModule,
    ReadersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    CitySelectorComponent,
    PlaceSelectorComponent,
    NpcSelectorComponent,
    StorySelectorComponent
  ]
})
export class ReadersModule { }
