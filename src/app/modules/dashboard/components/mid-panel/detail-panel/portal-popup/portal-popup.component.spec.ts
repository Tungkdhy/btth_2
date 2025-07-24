import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalPopupComponent } from './portal-popup.component';

describe('PortalPopupComponent', () => {
  let component: PortalPopupComponent;
  let fixture: ComponentFixture<PortalPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PortalPopupComponent]
    });
    fixture = TestBed.createComponent(PortalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
