import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HaveToPrintComponent } from './have-to-print/have-to-print.component';

@NgModule({
  declarations: [
    AppComponent,
    HaveToPrintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [HaveToPrintComponent]
})
export class AppModule { }
