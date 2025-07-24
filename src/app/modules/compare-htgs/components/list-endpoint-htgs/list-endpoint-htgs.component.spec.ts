import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEndpointHtgsComponent } from './list-endpoint-htgs.component';

describe('ListEndpointHtgsComponent', () => {
  let component: ListEndpointHtgsComponent;
  let fixture: ComponentFixture<ListEndpointHtgsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListEndpointHtgsComponent]
    });
    fixture = TestBed.createComponent(ListEndpointHtgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
