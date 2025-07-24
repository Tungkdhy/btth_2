import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ta21PopupComponent } from './ta21-popup.component';

describe('SwitchPopupComponent', () => {
  let component: Ta21PopupComponent;
  let fixture: ComponentFixture<Ta21PopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Ta21PopupComponent],
    });
    fixture = TestBed.createComponent(Ta21PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
