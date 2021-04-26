import { TestBed } from '@angular/core/testing';

import { UnidadmedidasService } from './unidadmedidas.service';

describe('UnidadmedidasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnidadmedidasService = TestBed.get(UnidadmedidasService);
    expect(service).toBeTruthy();
  });
});
