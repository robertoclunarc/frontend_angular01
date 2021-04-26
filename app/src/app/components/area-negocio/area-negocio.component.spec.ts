import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AreaNegocioComponent } from './area-negocio.component';

describe('AreaNegocioComponent', () => {
  let component: AreaNegocioComponent;
  let fixture: ComponentFixture<AreaNegocioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaNegocioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
