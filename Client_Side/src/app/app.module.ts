import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from 'src/app/app-router.module';
import { SharedCommons } from 'src/app/utils/shared.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { UserState } from './shared/store/users/users.reducer';
import { GeneralState } from './shared/store/general/general.reducer';
import { environment } from 'src/environments/environment';
import { LocationState } from './shared/store/locations/locations.reducer';
import { StoriesState } from './shared/store/stories/stories.reducer';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ...SharedCommons,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DeviceDetectorModule,
    NgxsModule.forRoot([UserState, GeneralState, LocationState, StoriesState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule { }

