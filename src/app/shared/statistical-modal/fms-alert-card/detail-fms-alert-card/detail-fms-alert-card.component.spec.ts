import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFmsAlertCardComponent } from './detail-fms-alert-card.component';

describe('DetailFmsAlertCardComponent', () => {
  let component: DetailFmsAlertCardComponent;
  let fixture: ComponentFixture<DetailFmsAlertCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailFmsAlertCardComponent]
    });
    fixture = TestBed.createComponent(DetailFmsAlertCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
