import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersSwitcherComponent } from './layers-switcher.component';

describe('LayersSwitcherComponent', () => {
  let component: LayersSwitcherComponent;
  let fixture: ComponentFixture<LayersSwitcherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayersSwitcherComponent]
    });
    fixture = TestBed.createComponent(LayersSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
