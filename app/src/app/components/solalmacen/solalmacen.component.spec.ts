import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SolalmacenComponent } from './solalmacen.component';

describe('SolalmacenComponent', () => {
  let component: SolalmacenComponent;
  let fixture: ComponentFixture<SolalmacenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolalmacenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolalmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
