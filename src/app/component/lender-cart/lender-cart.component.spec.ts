import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderCartComponent } from './lender-cart.component';

describe('LenderCartComponent', () => {
  let component: LenderCartComponent;
  let fixture: ComponentFixture<LenderCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
