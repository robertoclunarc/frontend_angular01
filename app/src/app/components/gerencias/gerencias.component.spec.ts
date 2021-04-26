import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GerenciasComponent } from './gerencias.component';

describe('GerenciasComponent', () => {
  let component: GerenciasComponent;
  let fixture: ComponentFixture<GerenciasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
