import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerRolModComponent } from './per-rol-mod.component';

describe('PerRolModComponent', () => {
  let component: PerRolModComponent;
  let fixture: ComponentFixture<PerRolModComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerRolModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerRolModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
