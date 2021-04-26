import { TestBed } from '@angular/core/testing';

import { EstadosSolpepService } from './estados-solpep.service';

describe('EstadosSolpepService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstadosSolpepService = TestBed.get(EstadosSolpepService);
    expect(service).toBeTruthy();
  });
});
