import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyInformationAlertSecondPopupComponent } from './safety-information-alert-second-popup.component';

describe('SafetyInformationAlertSecondPopupComponent', () => {
  let component: SafetyInformationAlertSecondPopupComponent;
  let fixture: ComponentFixture<SafetyInformationAlertSecondPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SafetyInformationAlertSecondPopupComponent]
    });
    fixture = TestBed.createComponent(SafetyInformationAlertSecondPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
