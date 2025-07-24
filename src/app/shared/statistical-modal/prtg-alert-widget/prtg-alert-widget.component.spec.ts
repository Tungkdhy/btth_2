import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrtgAlertWidgetComponent } from './prtg-alert-widget.component';

describe('PrtgAlertWidgetComponent', () => {
  let component: PrtgAlertWidgetComponent;
  let fixture: ComponentFixture<PrtgAlertWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrtgAlertWidgetComponent]
    });
    fixture = TestBed.createComponent(PrtgAlertWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
