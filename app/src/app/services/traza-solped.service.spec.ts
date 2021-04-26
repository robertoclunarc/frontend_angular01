import { TestBed } from '@angular/core/testing';

import { TrazaSolpedService } from './traza-solped.service';

describe('TrazaSolpedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrazaSolpedService = TestBed.get(TrazaSolpedService);
    expect(service).toBeTruthy();
  });
});
