import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterDetailPanelComponent } from './router-detail-panel.component';

describe('RouterDetailPanelComponent', () => {
  let component: RouterDetailPanelComponent;
  let fixture: ComponentFixture<RouterDetailPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterDetailPanelComponent]
    });
    fixture = TestBed.createComponent(RouterDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
