import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderPortalComponent } from './lender-portal.component';

describe('LenderPortalComponent', () => {
  let component: LenderPortalComponent;
  let fixture: ComponentFixture<LenderPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
