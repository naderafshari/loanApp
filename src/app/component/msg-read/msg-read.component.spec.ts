import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgReadComponent } from './msg-read.component';

describe('MsgReadComponent', () => {
  let component: MsgReadComponent;
  let fixture: ComponentFixture<MsgReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
