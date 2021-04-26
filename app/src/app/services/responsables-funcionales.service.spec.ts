import { TestBed } from '@angular/core/testing';

import { ResponsablesFuncionalesService } from './responsables-funcionales.service';

describe('ResponsablesFuncionalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResponsablesFuncionalesService = TestBed.get(ResponsablesFuncionalesService);
    expect(service).toBeTruthy();
  });
});
