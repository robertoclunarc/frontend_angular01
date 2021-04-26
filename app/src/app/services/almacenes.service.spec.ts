import { TestBed } from '@angular/core/testing';

import { AlmacenesService } from './almacenes.service';

describe('AlmacenesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlmacenesService = TestBed.get(AlmacenesService);
    expect(service).toBeTruthy();
  });
});
