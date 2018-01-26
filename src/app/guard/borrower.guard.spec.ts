import { TestBed, async, inject } from '@angular/core/testing';

import { BorrowerGuard } from './borrower.guard';

describe('BorrowerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BorrowerGuard]
    });
  });

  it('should ...', inject([BorrowerGuard], (guard: BorrowerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
