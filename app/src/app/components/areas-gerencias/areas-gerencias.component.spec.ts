import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AreasGerenciasComponent } from './areas-gerencias.component';

describe('AreasGerenciasComponent', () => {
  let component: AreasGerenciasComponent;
  let fixture: ComponentFixture<AreasGerenciasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AreasGerenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasGerenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
