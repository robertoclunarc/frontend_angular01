import { TestBed } from '@angular/core/testing';

import { PerfilesService } from './perfiles.service';

describe('PerfilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerfilesService = TestBed.get(PerfilesService);
    expect(service).toBeTruthy();
  });
});
