import { TestBed } from '@angular/core/testing';

import { SiabmScannerService } from './siabm-scanner.service';

describe('SiabmScannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SiabmScannerService = TestBed.get(SiabmScannerService);
    expect(service).toBeTruthy();
  });
});
