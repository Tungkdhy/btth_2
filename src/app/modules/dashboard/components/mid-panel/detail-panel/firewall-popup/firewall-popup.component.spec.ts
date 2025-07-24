import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirewallPopupComponent } from './firewall-popup.component';

describe('SwitchPopupComponent', () => {
  let component: FirewallPopupComponent;
  let fixture: ComponentFixture<FirewallPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirewallPopupComponent]
    });
    fixture = TestBed.createComponent(FirewallPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
