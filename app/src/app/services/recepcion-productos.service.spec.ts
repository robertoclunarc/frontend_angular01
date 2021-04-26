import { TestBed } from '@angular/core/testing';

import { RecepcionProductosService } from './recepcion-productos.service';

describe('RecepcionProductosService', () => {
  let service: RecepcionProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecepcionProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
