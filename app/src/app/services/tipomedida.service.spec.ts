import { TestBed } from '@angular/core/testing';

import { TipomedidaService } from './tipomedida.service';

describe('TipomedidaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipomedidaService = TestBed.get(TipomedidaService);
    expect(service).toBeTruthy();
  });
});
