import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerCreateComponent } from './user-manager-create.component';

describe('UserManagerCreateComponent', () => {
  let component: UserManagerCreateComponent;
  let fixture: ComponentFixture<UserManagerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserManagerCreateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UserManagerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
