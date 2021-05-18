import { NgModule } from '@angular/core';
import { PrinterService } from './printer.service';
import { PrinterContainerComponent } from './printer-container.component';
import { PrintServiceConfig } from './printer.models';
import { ModuleWithProviders } from '@angular/core';

@NgModule({
  providers: [PrinterService],
  entryComponents: [PrinterContainerComponent]
})
export class PrinterModule { 
  static forRoot(config: PrintServiceConfig): ModuleWithProviders<PrinterModule> {
    return {
      ngModule: PrinterModule,
      providers: [{ provide: PrintServiceConfig, useValue: config }]
    };
  }
}
