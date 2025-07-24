import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterAccessDetailPanelComponent } from './router-access-detail-panel.component';

describe('RouterAccessDetailPanelComponent', () => {
  let component: RouterAccessDetailPanelComponent;
  let fixture: ComponentFixture<RouterAccessDetailPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterAccessDetailPanelComponent]
    });
    fixture = TestBed.createComponent(RouterAccessDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
