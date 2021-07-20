import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesComprasRecepProdComponent } from './ordenes-compras-recep-prod.component';

describe('OrdenesComprasRecepProdComponent', () => {
  let component: OrdenesComprasRecepProdComponent;
  let fixture: ComponentFixture<OrdenesComprasRecepProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdenesComprasRecepProdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesComprasRecepProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
