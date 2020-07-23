import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WritersComponent } from './writers.component';
import { WritersRoutingModule } from 'src/app/writers/writers-router.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WriterNavComponent } from './components/writer-nav/writer-nav.component';
import { WritersHomeComponent } from './components/writers-home/writers-home.component';
import { WorldStoriesComponent } from './containers/world-stories/world-stories.component';
import { CitiesBuilderComponent } from './components/cities-builder/cities-builder.component';
import { PlacesBuilderComponent } from './components/places-builder/places-builder.component';
import { NpcBuilderComponent } from './components/npc-builder/npc-builder.component';
import { ChaptersBuilderComponent } from './components/chapters-builder/chapters-builder.component';

@NgModule({
  declarations: [
    WritersComponent,
    WriterNavComponent,
    WritersHomeComponent,
    WorldStoriesComponent,
    CitiesBuilderComponent,
    PlacesBuilderComponent,
    NpcBuilderComponent,
    ChaptersBuilderComponent,
    // NpcBuiderComponent
  ],
  imports: [
    CommonModule,
    WritersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class WritersModule { }
