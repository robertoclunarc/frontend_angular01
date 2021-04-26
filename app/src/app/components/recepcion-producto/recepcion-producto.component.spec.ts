import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecepcionProductoComponent } from './recepcion-producto.component';

describe('RecepcionProductoComponent', () => {
  let component: RecepcionProductoComponent;
  let fixture: ComponentFixture<RecepcionProductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecepcionProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
