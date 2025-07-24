import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoClientServerComponent } from './info-client-server.component';

describe('DeviceInfoCardComponent', () => {
  let component: InfoClientServerComponent;
  let fixture: ComponentFixture<InfoClientServerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfoClientServerComponent]
    });
    fixture = TestBed.createComponent(InfoClientServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
