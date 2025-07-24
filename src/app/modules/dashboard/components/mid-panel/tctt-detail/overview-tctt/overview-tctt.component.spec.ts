import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTcttComponent } from './overview-tctt.component';

describe('OverviewTcttComponent', () => {
  let component: OverviewTcttComponent;
  let fixture: ComponentFixture<OverviewTcttComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewTcttComponent]
    });
    fixture = TestBed.createComponent(OverviewTcttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
