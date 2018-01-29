import { TestBed, inject } from '@angular/core/testing';

import { LenderFormService } from './lender-form.service';

describe('LenderFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LenderFormService]
    });
  });

  it('should be created', inject([LenderFormService], (service: LenderFormService) => {
    expect(service).toBeTruthy();
  }));
});
