import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card2ColComponent } from './card-2-col.component';

describe('Card2ColComponent', () => {
  let component: Card2ColComponent;
  let fixture: ComponentFixture<Card2ColComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Card2ColComponent]
    });
    fixture = TestBed.createComponent(Card2ColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
