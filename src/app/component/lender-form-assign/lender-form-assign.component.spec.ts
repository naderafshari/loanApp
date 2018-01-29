import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderFormAssignComponent } from './lender-form-assign.component';

describe('LenderFormAssignComponent', () => {
  let component: LenderFormAssignComponent;
  let fixture: ComponentFixture<LenderFormAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderFormAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderFormAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
