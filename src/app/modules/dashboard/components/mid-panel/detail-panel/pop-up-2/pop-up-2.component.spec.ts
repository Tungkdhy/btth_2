import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUp2Component } from './pop-up-2.component';

describe('PopUp2Component', () => {
  let component: PopUp2Component;
  let fixture: ComponentFixture<PopUp2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUp2Component]
    });
    fixture = TestBed.createComponent(PopUp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
