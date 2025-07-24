import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotSpotComponent } from './hot-spot-statistic.component';

describe('HotSpotComponent', () => {
  let component: HotSpotComponent;
  let fixture: ComponentFixture<HotSpotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotSpotComponent],
    });
    fixture = TestBed.createComponent(HotSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
