import { TestBed } from '@angular/core/testing';

import { WebsocketapiService } from './websocketapi.service';

describe('WebsocketapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocketapiService = TestBed.get(WebsocketapiService);
    expect(service).toBeTruthy();
  });
});
