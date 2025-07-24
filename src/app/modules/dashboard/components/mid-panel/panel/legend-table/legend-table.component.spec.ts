import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendTableComponent } from './legend-table.component';

describe('LegendTableComponent', () => {
  let component: LegendTableComponent;
  let fixture: ComponentFixture<LegendTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LegendTableComponent]
    });
    fixture = TestBed.createComponent(LegendTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
