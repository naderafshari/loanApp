import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgComposeComponent } from './msg-compose.component';

describe('MsgComposeComponent', () => {
  let component: MsgComposeComponent;
  let fixture: ComponentFixture<MsgComposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgComposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
