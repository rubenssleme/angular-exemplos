import { TestBed } from '@angular/core/testing';

import { SimulateServerService } from './simulate-server.service';

describe('SimulateServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimulateServerService = TestBed.get(SimulateServerService);
    expect(service).toBeTruthy();
  });
});
