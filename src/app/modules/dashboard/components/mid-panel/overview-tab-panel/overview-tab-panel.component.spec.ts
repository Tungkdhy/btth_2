import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTabPanelComponent } from './overview-tab-panel.component';

describe('OverviewTabPanelComponent', () => {
  let component: OverviewTabPanelComponent;
  let fixture: ComponentFixture<OverviewTabPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverviewTabPanelComponent]
    });
    fixture = TestBed.createComponent(OverviewTabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
