import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgInboxComponent } from './msg-inbox.component';

describe('MsgInboxComponent', () => {
  let component: MsgInboxComponent;
  let fixture: ComponentFixture<MsgInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
