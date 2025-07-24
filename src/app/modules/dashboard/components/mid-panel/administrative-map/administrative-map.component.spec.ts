import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativeMapComponent } from './administrative-map.component';

describe('AdministrativeMapComponent', () => {
  let component: AdministrativeMapComponent;
  let fixture: ComponentFixture<AdministrativeMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdministrativeMapComponent]
    });
    fixture = TestBed.createComponent(AdministrativeMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
