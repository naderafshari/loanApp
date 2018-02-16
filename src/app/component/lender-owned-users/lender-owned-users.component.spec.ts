import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderOwnedUsersComponent } from './lender-owned-users.component';

describe('LenderOwnedUsersComponent', () => {
  let component: LenderOwnedUsersComponent;
  let fixture: ComponentFixture<LenderOwnedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderOwnedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderOwnedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
