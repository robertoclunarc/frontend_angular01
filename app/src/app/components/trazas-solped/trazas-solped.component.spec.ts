import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrazasSolpedComponent } from './trazas-solped.component';

describe('TrazasSolpedComponent', () => {
  let component: TrazasSolpedComponent;
  let fixture: ComponentFixture<TrazasSolpedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrazasSolpedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrazasSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
