import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrtgAlertCardSmallComponent } from './prtg-alert-card-small.component';

describe('PrtgAlertCardSmallComponent', () => {
  let component: PrtgAlertCardSmallComponent;
  let fixture: ComponentFixture<PrtgAlertCardSmallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrtgAlertCardSmallComponent]
    });
    fixture = TestBed.createComponent(PrtgAlertCardSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
