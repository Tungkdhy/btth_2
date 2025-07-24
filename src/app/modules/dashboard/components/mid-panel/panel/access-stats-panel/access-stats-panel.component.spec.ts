import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessStatsPanelComponent } from './access-stats-panel.component';

describe('AccessStatsPanelComponent', () => {
  let component: AccessStatsPanelComponent;
  let fixture: ComponentFixture<AccessStatsPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccessStatsPanelComponent]
    });
    fixture = TestBed.createComponent(AccessStatsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
