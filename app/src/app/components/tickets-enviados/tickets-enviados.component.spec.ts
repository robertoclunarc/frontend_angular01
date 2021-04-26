import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TicketsEnviadosComponent } from './tickets-enviados.component';

describe('TicketsEnviadosComponent', () => {
  let component: TicketsEnviadosComponent;
  let fixture: ComponentFixture<TicketsEnviadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsEnviadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsEnviadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
