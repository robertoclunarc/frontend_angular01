import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpreGerenAreaComponent } from './empre-geren-area.component';

describe('EmpreGerenAreaComponent', () => {
  let component: EmpreGerenAreaComponent;
  let fixture: ComponentFixture<EmpreGerenAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpreGerenAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpreGerenAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
