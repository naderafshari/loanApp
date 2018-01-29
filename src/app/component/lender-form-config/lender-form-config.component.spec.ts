import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderFormConfigComponent } from './lender-form-config.component';

describe('LenderFormConfigComponent', () => {
  let component: LenderFormConfigComponent;
  let fixture: ComponentFixture<LenderFormConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderFormConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderFormConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
