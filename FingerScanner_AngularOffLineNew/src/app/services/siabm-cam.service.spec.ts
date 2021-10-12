import { TestBed } from '@angular/core/testing';

import { SiabmCamService } from './siabm-cam.service';

describe('SiabmCamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SiabmCamService = TestBed.get(SiabmCamService);
    expect(service).toBeTruthy();
  });
});
