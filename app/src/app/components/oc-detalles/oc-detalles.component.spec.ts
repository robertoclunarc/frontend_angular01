import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcDetallesComponent } from './oc-detalles.component';

describe('OcDetallesComponent', () => {
  let component: OcDetallesComponent;
  let fixture: ComponentFixture<OcDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcDetallesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
