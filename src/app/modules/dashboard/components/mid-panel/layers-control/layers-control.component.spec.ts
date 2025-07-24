import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersControlComponent } from './layers-control.component';

describe('LayersControlComponent', () => {
  let component: LayersControlComponent;
  let fixture: ComponentFixture<LayersControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayersControlComponent]
    });
    fixture = TestBed.createComponent(LayersControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
