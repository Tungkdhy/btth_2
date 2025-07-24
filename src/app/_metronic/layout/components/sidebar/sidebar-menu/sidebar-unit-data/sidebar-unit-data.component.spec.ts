import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarUnitDataComponent } from './sidebar-unit-data.component';

describe('SidebarUnitDataComponent', () => {
  let component: SidebarUnitDataComponent;
  let fixture: ComponentFixture<SidebarUnitDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarUnitDataComponent]
    });
    fixture = TestBed.createComponent(SidebarUnitDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
