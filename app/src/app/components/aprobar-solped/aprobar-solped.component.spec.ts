import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AprobarSolpedComponent } from './aprobar-solped.component';

describe('AprobarSolpedComponent', () => {
  let component: AprobarSolpedComponent;
  let fixture: ComponentFixture<AprobarSolpedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarSolpedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
