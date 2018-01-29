import { TestBed, async, inject } from '@angular/core/testing';

import { LenderAdminGuard } from './lender-admin.guard';

describe('LenderAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LenderAdminGuard]
    });
  });

  it('should ...', inject([LenderAdminGuard], (guard: LenderAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
