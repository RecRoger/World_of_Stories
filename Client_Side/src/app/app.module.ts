import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { SharedModule } from './../shared/shared.module';
// Router
import { AppComponent } from './app.component';
import { AppRoutingModule } from 'src/app/app-router.module';
import { SharedModule } from 'src/app/shared/shared.module';
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
    SharedModule,
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
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: createTranslateLoader,
    //     deps: [HttpClient]
    //   }
    // })
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule { }

// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
