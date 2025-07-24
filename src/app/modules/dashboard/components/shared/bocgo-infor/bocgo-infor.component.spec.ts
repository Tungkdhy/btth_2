import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BocgoInforComponent } from './bocgo-infor.component';

describe('BocgoInforComponent', () => {
  let component: BocgoInforComponent;
  let fixture: ComponentFixture<BocgoInforComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BocgoInforComponent]
    });
    fixture = TestBed.createComponent(BocgoInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
