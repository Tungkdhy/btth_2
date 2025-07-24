import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlinkBlinkChanelComponent } from './blink-blink-chanel.component';

describe('BlinkBlinkChanelComponent', () => {
  let component: BlinkBlinkChanelComponent;
  let fixture: ComponentFixture<BlinkBlinkChanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlinkBlinkChanelComponent]
    });
    fixture = TestBed.createComponent(BlinkBlinkChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
