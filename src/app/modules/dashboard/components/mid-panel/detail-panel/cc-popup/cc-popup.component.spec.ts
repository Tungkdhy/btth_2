import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCPopupComponent } from './cc-popup.component';

describe('SwitchPopupComponent', () => {
  let component: CCPopupComponent;
  let fixture: ComponentFixture<CCPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CCPopupComponent],
    });
    fixture = TestBed.createComponent(CCPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
