import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyInformationAlertPopupComponent } from './safety-information-alert-popup.component';

describe('SafetyInformationAlertPopupComponent', () => {
  let component: SafetyInformationAlertPopupComponent;
  let fixture: ComponentFixture<SafetyInformationAlertPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SafetyInformationAlertPopupComponent]
    });
    fixture = TestBed.createComponent(SafetyInformationAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
