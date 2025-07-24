import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyWrapperCardComponent } from './topology-wrapper-card.component';

describe('TopologyWrapperCardComponent', () => {
  let component: TopologyWrapperCardComponent;
  let fixture: ComponentFixture<TopologyWrapperCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TopologyWrapperCardComponent]
    });
    fixture = TestBed.createComponent(TopologyWrapperCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
