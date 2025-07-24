import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrtgAlertCardPanelComponent } from './prtg-alert-card-panel.component';

describe('PrtgAlertCardPanelComponent', () => {
  let component: PrtgAlertCardPanelComponent;
  let fixture: ComponentFixture<PrtgAlertCardPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrtgAlertCardPanelComponent]
    });
    fixture = TestBed.createComponent(PrtgAlertCardPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
