import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFunctionComponent } from './user-function.component';

describe('UserFunctionComponent', () => {
  let component: UserFunctionComponent;
  let fixture: ComponentFixture<UserFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
