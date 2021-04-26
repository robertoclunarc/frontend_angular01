import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FasesSolpedComponent } from './fases-solped.component';

describe('FasesSolpedComponent', () => {
  let component: FasesSolpedComponent;
  let fixture: ComponentFixture<FasesSolpedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FasesSolpedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasesSolpedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
