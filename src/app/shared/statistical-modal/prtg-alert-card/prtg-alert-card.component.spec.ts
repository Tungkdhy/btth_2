import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrtgAlertCardComponent } from './prtg-alert-card.component';

describe('PrtgAlertCardComponent', () => {
  let component: PrtgAlertCardComponent;
  let fixture: ComponentFixture<PrtgAlertCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrtgAlertCardComponent]
    });
    fixture = TestBed.createComponent(PrtgAlertCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
