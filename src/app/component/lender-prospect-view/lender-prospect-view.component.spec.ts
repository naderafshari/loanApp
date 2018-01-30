import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderProspectViewComponent } from './lender-prospect-view.component';

describe('LenderProspectViewComponent', () => {
  let component: LenderProspectViewComponent;
  let fixture: ComponentFixture<LenderProspectViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LenderProspectViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LenderProspectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
