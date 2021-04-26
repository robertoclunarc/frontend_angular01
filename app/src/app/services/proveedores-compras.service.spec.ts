import { TestBed } from '@angular/core/testing';

import { ProveedoresComprasService } from './proveedores-compras.service';

describe('ProveedoresComprasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProveedoresComprasService = TestBed.get(ProveedoresComprasService);
    expect(service).toBeTruthy();
  });
});
