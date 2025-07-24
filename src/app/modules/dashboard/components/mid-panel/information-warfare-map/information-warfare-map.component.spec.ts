import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationWarfareMapComponent } from './information-warfare-map.component';

describe('InformationWarfareMapComponent', () => {
  let component: InformationWarfareMapComponent;
  let fixture: ComponentFixture<InformationWarfareMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InformationWarfareMapComponent]
    });
    fixture = TestBed.createComponent(InformationWarfareMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
