import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalModalContentComponent } from './statistical-modal-content.component';

describe('StatisticalModalContentComponent', () => {
  let component: StatisticalModalContentComponent;
  let fixture: ComponentFixture<StatisticalModalContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatisticalModalContentComponent]
    });
    fixture = TestBed.createComponent(StatisticalModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
