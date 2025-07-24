import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationCardComponent } from './configuration-card.component';

describe('DeviceComputerListCardComponent', () => {
  let component: ConfigurationCardComponent;
  let fixture: ComponentFixture<ConfigurationCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigurationCardComponent]
    });
    fixture = TestBed.createComponent(ConfigurationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
