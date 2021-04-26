import { TestBed } from '@angular/core/testing';

import { ResponsablesValidacionService } from './responsables-validacion.service';

describe('ResponsablesValidacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResponsablesValidacionService = TestBed.get(ResponsablesValidacionService);
    expect(service).toBeTruthy();
  });
});
