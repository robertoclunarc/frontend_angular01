import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FtAlmacenProductoComponent } from './ft-almacen-producto.component';

describe('FtAlmacenProductoComponent', () => {
  let component: FtAlmacenProductoComponent;
  let fixture: ComponentFixture<FtAlmacenProductoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FtAlmacenProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtAlmacenProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
