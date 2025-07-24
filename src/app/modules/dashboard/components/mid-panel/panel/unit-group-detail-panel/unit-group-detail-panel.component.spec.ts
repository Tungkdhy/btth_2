import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitGroupDetailPanelComponent } from './unit-group-detail-panel.component';

describe('UnitGroupDetailPanelComponent', () => {
  let component: UnitGroupDetailPanelComponent;
  let fixture: ComponentFixture<UnitGroupDetailPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnitGroupDetailPanelComponent]
    });
    fixture = TestBed.createComponent(UnitGroupDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
