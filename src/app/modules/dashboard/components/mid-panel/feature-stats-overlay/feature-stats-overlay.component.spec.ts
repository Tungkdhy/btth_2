import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureStatsOverlayComponent } from './feature-stats-overlay.component';

describe('FeatureStatsOverlayComponent', () => {
  let component: FeatureStatsOverlayComponent;
  let fixture: ComponentFixture<FeatureStatsOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeatureStatsOverlayComponent]
    });
    fixture = TestBed.createComponent(FeatureStatsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
