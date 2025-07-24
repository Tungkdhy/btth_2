import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsPopupComponent } from './agents-popup.component';

describe('SwitchPopupComponent', () => {
  let component: AgentsPopupComponent;
  let fixture: ComponentFixture<AgentsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgentsPopupComponent],
    });
    fixture = TestBed.createComponent(AgentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
