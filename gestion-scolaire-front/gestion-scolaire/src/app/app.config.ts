import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers:[
    importProvidersFrom(BrowserModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(CommonModule),
    importProvidersFrom(RouterModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(NgxPrintModule),
    provideRouter(routes),
    importProvidersFrom(ToastrModule.forRoot({ //pour les notifications
      positionClass: 'toast-top-center',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    })),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    
  ]
};
