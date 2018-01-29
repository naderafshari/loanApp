import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderFormHistoryComponent } from './lender-form-history.component';

describe('LenderFormHistoryComponent', () => {
  let component: LenderFormHistoryComponent;
  let fixture: ComponentFixture<LenderFormHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderFormHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderFormHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
