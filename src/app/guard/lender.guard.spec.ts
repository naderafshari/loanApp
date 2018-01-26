import { TestBed, async, inject } from '@angular/core/testing';

import { LenderGuard } from './lender.guard';

describe('LenderGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LenderGuard]
    });
  });

  it('should ...', inject([LenderGuard], (guard: LenderGuard) => {
    expect(guard).toBeTruthy();
  }));
});
