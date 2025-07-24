import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmsPopupComponent } from './fms-popup.component';

describe('SwitchPopupComponent', () => {
  let component: FmsPopupComponent;
  let fixture: ComponentFixture<FmsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FmsPopupComponent],
    });
    fixture = TestBed.createComponent(FmsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
