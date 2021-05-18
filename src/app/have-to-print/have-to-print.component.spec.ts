import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaveToPrintComponent } from './have-to-print.component';

describe('HaveToPrintComponent', () => {
  let component: HaveToPrintComponent;
  let fixture: ComponentFixture<HaveToPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HaveToPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaveToPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
