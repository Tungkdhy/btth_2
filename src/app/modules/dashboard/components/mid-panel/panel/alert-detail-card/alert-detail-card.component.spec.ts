import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDetailCardComponent } from './alert-detail-card.component';

describe('AlertDetailCardComponent', () => {
  let component: AlertDetailCardComponent;
  let fixture: ComponentFixture<AlertDetailCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertDetailCardComponent]
    });
    fixture = TestBed.createComponent(AlertDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
