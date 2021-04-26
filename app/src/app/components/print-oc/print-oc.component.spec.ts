import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOcComponent } from './print-oc.component';

describe('PrintOcComponent', () => {
  let component: PrintOcComponent;
  let fixture: ComponentFixture<PrintOcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintOcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
