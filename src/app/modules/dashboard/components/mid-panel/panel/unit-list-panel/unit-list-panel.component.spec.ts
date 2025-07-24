import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitListPanelComponent } from './unit-list-panel.component';

describe('UnitListPanelComponent', () => {
  let component: UnitListPanelComponent;
  let fixture: ComponentFixture<UnitListPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnitListPanelComponent]
    });
    fixture = TestBed.createComponent(UnitListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
