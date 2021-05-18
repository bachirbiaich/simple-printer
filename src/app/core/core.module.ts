import { NgModule } from '@angular/core';
import { PrinterModule } from './printer/printer.module';

@NgModule({
  declarations: [],
  imports: [
    PrinterModule.forRoot({})
  ]
})
export class CoreModule { }
