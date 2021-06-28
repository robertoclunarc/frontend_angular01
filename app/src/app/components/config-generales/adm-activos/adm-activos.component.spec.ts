import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmActivosComponent } from './adm-activos.component';

describe('AdmActivosComponent', () => {
  let component: AdmActivosComponent;
  let fixture: ComponentFixture<AdmActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmActivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
