import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolpedsdetalleComponent } from './solpedsdetalle.component';

describe('SolpedsdetalleComponent', () => {
  let component: SolpedsdetalleComponent;
  let fixture: ComponentFixture<SolpedsdetalleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolpedsdetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolpedsdetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
