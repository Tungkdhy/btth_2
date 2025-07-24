import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IwHotspotTableComponent } from './iw-hotspot-table.component';

describe('IwHotspotTableComponent', () => {
  let component: IwHotspotTableComponent;
  let fixture: ComponentFixture<IwHotspotTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IwHotspotTableComponent]
    });
    fixture = TestBed.createComponent(IwHotspotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
