import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolpedOCComponent } from './solped-oc.component';

describe('SolpedOCComponent', () => {
  let component: SolpedOCComponent;
  let fixture: ComponentFixture<SolpedOCComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolpedOCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolpedOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
