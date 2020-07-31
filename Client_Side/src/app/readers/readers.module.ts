import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadersComponent } from './readers.component';
import { ReadersRoutingModule } from './readers-router.module';
import { SharedModule } from '../shared/shared.module';
import { ReaderNavComponent } from './componentes/reader-nav/reader-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadersHomeComponent } from './componentes/readers-home/readers-home.component';
import { SelectCityComponent } from './componentes/select-city/select-city.component';
import { ReadCityComponent } from './componentes/read-city/read-city.component';
import { ReadPlaceComponent } from './componentes/read-place/read-place.component';



@NgModule({
  declarations: [ReadersComponent, ReaderNavComponent, ReadersHomeComponent, SelectCityComponent, ReadCityComponent, ReadPlaceComponent],
  imports: [
    CommonModule,
    ReadersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReadersModule { }
