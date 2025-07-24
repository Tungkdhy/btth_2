import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddRemovePopupComponent } from './service-add-remove-popup.component';

describe('ServiceAddRemovePopupComponent', () => {
  let component: ServiceAddRemovePopupComponent;
  let fixture: ComponentFixture<ServiceAddRemovePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServiceAddRemovePopupComponent]
    });
    fixture = TestBed.createComponent(ServiceAddRemovePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
