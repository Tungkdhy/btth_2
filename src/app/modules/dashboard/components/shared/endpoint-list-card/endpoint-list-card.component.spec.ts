import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointListCardComponent } from './endpoint-list-card.component';

describe('EndpointListCardComponent', () => {
  let component: EndpointListCardComponent;
  let fixture: ComponentFixture<EndpointListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EndpointListCardComponent]
    });
    fixture = TestBed.createComponent(EndpointListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
