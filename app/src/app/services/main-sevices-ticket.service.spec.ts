import { TestBed } from '@angular/core/testing';

import { MainSevicesTicketService } from './main-sevices-ticket.service';

describe('MainSevicesTicketService', () => {
  let service: MainSevicesTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainSevicesTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
