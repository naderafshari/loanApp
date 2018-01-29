import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderFormManageComponent } from './lender-form-manage.component';

describe('LenderFormManageComponent', () => {
  let component: LenderFormManageComponent;
  let fixture: ComponentFixture<LenderFormManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderFormManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderFormManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
