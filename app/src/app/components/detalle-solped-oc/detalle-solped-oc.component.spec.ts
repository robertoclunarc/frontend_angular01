import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetalleSolpedOcComponent } from './detalle-solped-oc.component';

describe('DetalleSolpedOcComponent', () => {
  let component: DetalleSolpedOcComponent;
  let fixture: ComponentFixture<DetalleSolpedOcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleSolpedOcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSolpedOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
