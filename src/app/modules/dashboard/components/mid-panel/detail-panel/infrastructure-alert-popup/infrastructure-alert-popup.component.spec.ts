import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureAlertPopupComponent } from './infrastructure-alert-popup.component';

describe('InfrastructureAlertPopupComponent', () => {
  let component: InfrastructureAlertPopupComponent;
  let fixture: ComponentFixture<InfrastructureAlertPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureAlertPopupComponent]
    });
    fixture = TestBed.createComponent(InfrastructureAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
