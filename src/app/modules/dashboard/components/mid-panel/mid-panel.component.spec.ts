import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidPanelComponent } from './mid-panel.component';

describe('MidPanelComponent', () => {
  let component: MidPanelComponent;
  let fixture: ComponentFixture<MidPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MidPanelComponent]
    });
    fixture = TestBed.createComponent(MidPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
