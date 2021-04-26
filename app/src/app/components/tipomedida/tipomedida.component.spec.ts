import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipomedidaComponent } from './tipomedida.component';

describe('TipomedidaComponent', () => {
  let component: TipomedidaComponent;
  let fixture: ComponentFixture<TipomedidaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TipomedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipomedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
