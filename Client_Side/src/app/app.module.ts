import { HttpClient, HttpClientModule } from '@angular/common/http';
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
