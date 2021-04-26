import { TestBed } from '@angular/core/testing';

import { RelacionAreasGerenciasService } from './relacion-areas-gerencias.service';

describe('RelacionAreasGerenciasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelacionAreasGerenciasService = TestBed.get(RelacionAreasGerenciasService);
    expect(service).toBeTruthy();
  });
});
