import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOverviewPanelComponent } from './unit-overview-panel.component';

describe('UnitOverviewPanelComponent', () => {
  let component: UnitOverviewPanelComponent;
  let fixture: ComponentFixture<UnitOverviewPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnitOverviewPanelComponent]
    });
    fixture = TestBed.createComponent(UnitOverviewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
