import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViralPostsComponent } from './viral-posts.component';

describe('ViralPostsComponent', () => {
  let component: ViralPostsComponent;
  let fixture: ComponentFixture<ViralPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViralPostsComponent]
    });
    fixture = TestBed.createComponent(ViralPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
