import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrazasOcListComponent } from './trazas-oc-list.component';

describe('TrazasOcListComponent', () => {
  let component: TrazasOcListComponent;
  let fixture: ComponentFixture<TrazasOcListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrazasOcListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrazasOcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
