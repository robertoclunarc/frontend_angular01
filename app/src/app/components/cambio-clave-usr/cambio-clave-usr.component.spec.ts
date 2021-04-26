import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CambioClaveUsrComponent } from './cambio-clave-usr.component';

describe('CambioClaveUsrComponent', () => {
  let component: CambioClaveUsrComponent;
  let fixture: ComponentFixture<CambioClaveUsrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioClaveUsrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioClaveUsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
