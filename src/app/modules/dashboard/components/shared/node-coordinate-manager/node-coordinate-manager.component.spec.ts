import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeCoordinateManagerComponent } from './node-coordinate-manager.component';

describe('NodeCoordinateManagerComponent', () => {
  let component: NodeCoordinateManagerComponent;
  let fixture: ComponentFixture<NodeCoordinateManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeCoordinateManagerComponent]
    });
    fixture = TestBed.createComponent(NodeCoordinateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
