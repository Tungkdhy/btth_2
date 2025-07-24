import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerInfoComponent } from './user-manager-info.component';

describe('UserManagerInfoComponent', () => {
  let component: UserManagerInfoComponent;
  let fixture: ComponentFixture<UserManagerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserManagerInfoComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UserManagerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
