import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PrinterService } from './core/printer/printer.service';
import { HaveToPrintComponent } from './have-to-print/have-to-print.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'demo-angular';
  @ViewChild('dive', {static: true}) dive: ElementRef<any> | undefined;
  
  constructor(private printerService: PrinterService) {
  }

  ngOnInit(): void {
    
  }

  print(): void {
    if(this.dive)
    //console.log(this.dive.nativeElement);
    this.printerService.printAngular(AppComponent);
  }
  
}
