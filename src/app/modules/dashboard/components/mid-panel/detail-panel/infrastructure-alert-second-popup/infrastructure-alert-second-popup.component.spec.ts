import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureAlertSecondPopupComponent } from './infrastructure-alert-second-popup.component';

describe('InfrastructureAlertSecondPopupComponent', () => {
  let component: InfrastructureAlertSecondPopupComponent;
  let fixture: ComponentFixture<InfrastructureAlertSecondPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureAlertSecondPopupComponent]
    });
    fixture = TestBed.createComponent(InfrastructureAlertSecondPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
