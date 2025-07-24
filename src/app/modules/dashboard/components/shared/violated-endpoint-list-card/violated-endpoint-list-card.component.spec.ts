import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolatedEndpointListCardComponent } from './violated-endpoint-list-card.component';

describe('ViolatedEndpointListCardComponent', () => {
  let component: ViolatedEndpointListCardComponent;
  let fixture: ComponentFixture<ViolatedEndpointListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViolatedEndpointListCardComponent]
    });
    fixture = TestBed.createComponent(ViolatedEndpointListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
