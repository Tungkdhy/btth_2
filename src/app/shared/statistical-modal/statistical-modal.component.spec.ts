import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalModalComponent } from './statistical-modal.component';

describe('StatisticalModalComponent', () => {
  let component: StatisticalModalComponent;
  let fixture: ComponentFixture<StatisticalModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatisticalModalComponent]
    });
    fixture = TestBed.createComponent(StatisticalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
