import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerPasswordComponent } from './user-manager-password.component';

describe('UserManagerPasswordComponent', () => {
  let component: UserManagerPasswordComponent;
  let fixture: ComponentFixture<UserManagerPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserManagerPasswordComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UserManagerPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
