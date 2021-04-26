import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogtransaccComponent } from './logtransacc.component';

describe('LogtransaccComponent', () => {
  let component: LogtransaccComponent;
  let fixture: ComponentFixture<LogtransaccComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogtransaccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogtransaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
