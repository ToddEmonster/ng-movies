import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UiModule } from './shared/ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { SearchComponent } from './pages/home/search/search.component';
import { MovieComponent } from './pages/movie/movie.component';
import { DeleteComponent } from './pages/movie/delete/delete.component'
import { AppConfig } from './core/init/app-config';
import { TokenInterceptorService } from './core/services/token-interceptor.service';

// Token LOCATION_INITIALIZED
import { LOCATION_INITIALIZED } from '@angular/common';
// Translate module
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core'; 
import { TranslationService } from './core/services/translation.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 


// Define a function that invoke TranslationService
export function translationInitializerFactory (
  translateService: TranslateService, // The one from @ngw-translate
  translationService: TranslationService, // The one of our own... will be instanciated
  injector: Injector // Injection service
) {
  return (): Promise<void> => {
    return translationService.init(translateService, injector);
  } // Returns a function that returns a Promise
}

// HttpLoaderFactory to get translation files
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json'
  );  
}

export function initializeApp(appConfig: AppConfig) {
  return (): Promise<any> => { 
    return appConfig.init();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SearchComponent,
    MovieComponent,
    DeleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    UiModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AppConfig,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    { provide: APP_INITIALIZER,useFactory: initializeApp, deps: [AppConfig], multi: true},
    {
      provide: APP_INITIALIZER, // angular token given app init
      useFactory: translationInitializerFactory,
      deps: [
        TranslateService,
        TranslationService,
        Injector
      ],
      multi: true // or others couldn't be loaded
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
