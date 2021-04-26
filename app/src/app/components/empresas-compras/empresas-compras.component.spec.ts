import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpresasComprasComponent } from './empresas-compras.component';

describe('EmpresasComprasComponent', () => {
  let component: EmpresasComprasComponent;
  let fixture: ComponentFixture<EmpresasComprasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresasComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
