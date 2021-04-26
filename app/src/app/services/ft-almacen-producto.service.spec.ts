import { TestBed } from '@angular/core/testing';

import { FtAlmacenProductoService } from './ft-almacen-producto.service';

describe('FtAlmacenProductoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FtAlmacenProductoService = TestBed.get(FtAlmacenProductoService);
    expect(service).toBeTruthy();
  });
});
