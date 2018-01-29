import { TestBed, async, inject } from '@angular/core/testing';

import { BorrowerAdminGuard } from './borrower-admin.guard';

describe('BorrowerAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BorrowerAdminGuard]
    });
  });

  it('should ...', inject([BorrowerAdminGuard], (guard: BorrowerAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
