import { TestBed } from '@angular/core/testing';
import { doesNotThrow } from 'assert';
import { PrinterService } from './printer.service';
import { PrintServiceConfig } from './printer.models';

describe('PrinterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  let service: PrinterService;
  const serviceConfig = new PrintServiceConfig();

  serviceConfig.timeToWaitRender = 20;
  serviceConfig.printOpenWindow = false;

  createTestDivs();

  beforeEach(() => {
    service = TestBed.inject(PrinterService);
    expect(service).toBeTruthy();
  });
  
  it('PrinterService should be created', () => {
    service = TestBed.inject(PrinterService);
    expect(service).toBeTruthy();
  });

  it('should print item', done => {
    service._printDiv('Div1');

    setTimeout(() => {
      console.log('expect print');
      expect(document.querySelector('ngx-printer')).toEqual(null);
    }, service.timeToWaitRender + 10);

    setTimeout(() => {
      const subcriptionAdd = service.printWindowOpen$.subscribe(data => {
        console.log(data);
        expect(data).toBe(false);
        done();
      });
      subcriptionAdd.unsubscribe();
    }, 25);
  });
});

function createTestDivs() {
  const newElem = <HTMLDivElement>document.createElement('div');
  newElem.id = 'Div1';
  newElem.innerHTML = 'Test Div 1';
  const newElem2 = <HTMLDivElement>document.createElement('div');
  newElem2.id = 'Div2';
  newElem2.innerHTML = 'Test Div 2';
  document.body.appendChild(newElem);
  document.body.appendChild(newElem2);
}