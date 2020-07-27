import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadersComponent } from './readers.component';
import { ReadersRoutingModule } from './readers-router.module';
import { SharedModule } from '../shared/shared.module';
import { ReaderNavComponent } from './componentes/reader-nav/reader-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ReadersComponent, ReaderNavComponent],
  imports: [
    CommonModule,
    ReadersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReadersModule { }
