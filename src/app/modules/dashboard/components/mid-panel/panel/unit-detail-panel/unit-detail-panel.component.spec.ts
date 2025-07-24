import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDetailPanelComponent } from './unit-detail-panel.component';

describe('UnitDetailPanelComponent', () => {
  let component: UnitDetailPanelComponent;
  let fixture: ComponentFixture<UnitDetailPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnitDetailPanelComponent]
    });
    fixture = TestBed.createComponent(UnitDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
