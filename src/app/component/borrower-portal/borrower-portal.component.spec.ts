import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerPortalComponent } from './borrower-portal.component';

describe('BorrowerPortalComponent', () => {
  let component: BorrowerPortalComponent;
  let fixture: ComponentFixture<BorrowerPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
