import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointAddRemovePopupComponent } from './endpoint-add-remove-popup.component';

describe('EndpointAddRemovePopupComponent', () => {
  let component: EndpointAddRemovePopupComponent;
  let fixture: ComponentFixture<EndpointAddRemovePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EndpointAddRemovePopupComponent]
    });
    fixture = TestBed.createComponent(EndpointAddRemovePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
