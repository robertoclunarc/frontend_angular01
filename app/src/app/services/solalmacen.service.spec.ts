import { TestBed } from '@angular/core/testing';

import { SolalmacenService } from './solalmacen.service';

describe('SolalmacenService', () => {
  let service: SolalmacenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolalmacenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
