import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadersComponent } from './readers.component';
import { ReadersRoutingModule } from './readers-router.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ReadersComponent],
  imports: [
    CommonModule,
    ReadersRoutingModule,
    SharedModule
    // FormsModule,
    // ReactiveFormsModule
  ]
})
export class ReadersModule { }
