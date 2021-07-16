import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcMasterComponent } from './oc-master.component';

describe('OcMasterComponent', () => {
  let component: OcMasterComponent;
  let fixture: ComponentFixture<OcMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
