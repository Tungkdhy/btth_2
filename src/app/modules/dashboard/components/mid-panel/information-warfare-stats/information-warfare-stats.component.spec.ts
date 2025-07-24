import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationWarfareStatsComponent } from './information-warfare-stats.component';

describe('InformationWarfareStatsComponent', () => {
  let component: InformationWarfareStatsComponent;
  let fixture: ComponentFixture<InformationWarfareStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InformationWarfareStatsComponent]
    });
    fixture = TestBed.createComponent(InformationWarfareStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
