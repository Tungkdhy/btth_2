import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberReconnaissanceComponent } from './cyber-reconnaissance.component';

describe('CyberReconnaissanceComponent', () => {
  let component: CyberReconnaissanceComponent;
  let fixture: ComponentFixture<CyberReconnaissanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CyberReconnaissanceComponent]
    });
    fixture = TestBed.createComponent(CyberReconnaissanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
